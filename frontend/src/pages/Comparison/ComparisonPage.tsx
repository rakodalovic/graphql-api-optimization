import React, { useState } from 'react';
import './ComparisonPage.css';

interface Scenario {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  restRequests: number;
  graphqlRequests: number;
}

const scenarios: Scenario[] = [
  {
    id: 'overfetching',
    title: 'Over-fetching',
    description: 'Display product cards with only name, price, and image',
    fullDescription: 'REST returns ALL product fields even when only 3 are needed. GraphQL returns exactly what you request.',
    restRequests: 1,
    graphqlRequests: 1,
  },
  {
    id: 'underfetching',
    title: 'Under-fetching / N+1',
    description: 'Display products with category names and review counts',
    fullDescription: 'REST requires 21 separate requests (1 for products + 10 for categories + 10 for reviews). GraphQL fetches everything in 1 request.',
    restRequests: 21,
    graphqlRequests: 1,
  },
  {
    id: 'nested',
    title: 'Complex Nested Query',
    description: 'Product details with category, reviews, users, and related products',
    fullDescription: 'REST requires 7+ requests depending on review count. GraphQL handles all nested data in a single request with DataLoader optimization.',
    restRequests: 7,
    graphqlRequests: 1,
  },
];

interface ApiResult {
  requestCount: number;
  responseTime: number;
  payloadSize: number;
  data: any;
  code: string;
}

const ComparisonPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [restResult, setRestResult] = useState<ApiResult | null>(null);
  const [graphqlResult, setGraphqlResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setRestResult(null);
    setGraphqlResult(null);

    try {
      // Run REST API test
      const restStartTime = performance.now();
      const restResult = await runRestScenario(selectedScenario.id);
      const restEndTime = performance.now();
      const restTime = Math.round(restEndTime - restStartTime);

      setRestResult({
        requestCount: selectedScenario.restRequests,
        responseTime: restTime,
        payloadSize: restResult.totalBytes,
        data: restResult.data,
        code: getRestCode(selectedScenario.id),
      });

      // Run GraphQL API test
      const graphqlStartTime = performance.now();
      const graphqlData = await runGraphQLScenario(selectedScenario.id);
      const graphqlEndTime = performance.now();
      const graphqlTime = Math.round(graphqlEndTime - graphqlStartTime);

      setGraphqlResult({
        requestCount: selectedScenario.graphqlRequests,
        responseTime: graphqlTime,
        payloadSize: new Blob([JSON.stringify(graphqlData)]).size,
        data: graphqlData,
        code: getGraphQLCode(selectedScenario.id),
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred during testing');
    } finally {
      setLoading(false);
    }
  };

  const runRestScenario = async (scenarioId: string): Promise<{ data: any, totalBytes: number }> => {
    const baseUrl = 'http://localhost:5002/api';
    let totalBytes = 0;

    if (scenarioId === 'overfetching') {
      const response = await fetch(`${baseUrl}/products?limit=10`);
      const data = await response.json();
      totalBytes = new Blob([JSON.stringify(data)]).size;
      return { data, totalBytes };
    } else if (scenarioId === 'underfetching') {
      // Simulate N+1 problem - fetch products, then categories, then reviews
      const productsRes = await fetch(`${baseUrl}/products?limit=10`);
      const products = await productsRes.json();
      totalBytes += new Blob([JSON.stringify(products)]).size;

      // Fetch category for each product
      const categories = await Promise.all(
        products.map(async (p: any) => {
          const res = await fetch(`${baseUrl}/products/${p.id}/category`);
          const data = await res.json();
          totalBytes += new Blob([JSON.stringify(data)]).size;
          return data;
        })
      );

      // Fetch reviews for each product
      const reviews = await Promise.all(
        products.map(async (p: any) => {
          const res = await fetch(`${baseUrl}/products/${p.id}/reviews`);
          const data = await res.json();
          totalBytes += new Blob([JSON.stringify(data)]).size;
          return data;
        })
      );

      // Combine all the data
      const combinedData = {
        products,
        categories,
        reviews
      };

      return { data: combinedData, totalBytes };
    } else if (scenarioId === 'nested') {
      // Complex nested scenario
      const productRes = await fetch(`${baseUrl}/products/1`);
      const product = await productRes.json();
      totalBytes += new Blob([JSON.stringify(product)]).size;

      const categoryRes = await fetch(`${baseUrl}/categories/${product.categoryId}`);
      const category = await categoryRes.json();
      totalBytes += new Blob([JSON.stringify(category)]).size;

      const reviewsRes = await fetch(`${baseUrl}/products/1/reviews`);
      const reviews = await reviewsRes.json();
      totalBytes += new Blob([JSON.stringify(reviews)]).size;

      // Fetch user for each review (simulating N+1)
      const users = await Promise.all(
        reviews.slice(0, 3).map(async (r: any) => {
          const res = await fetch(`${baseUrl}/users/${r.userId}`);
          const data = await res.json();
          totalBytes += new Blob([JSON.stringify(data)]).size;
          return data;
        })
      );

      const relatedProductsRes = await fetch(`${baseUrl}/categories/${product.categoryId}/products?limit=4`);
      const relatedProducts = await relatedProductsRes.json();
      totalBytes += new Blob([JSON.stringify(relatedProducts)]).size;

      // Combine all data
      const combinedData = {
        product,
        category,
        reviews,
        users,
        relatedProducts
      };

      return { data: combinedData, totalBytes };
    }

    return { data: {}, totalBytes: 0 };
  };

  const runGraphQLScenario = async (scenarioId: string): Promise<any> => {
    const graphqlUrl = 'http://localhost:5001/graphql';

    let query = '';
    let variables = {};

    if (scenarioId === 'overfetching') {
      query = `
        query {
          products(first: 10) {
            nodes {
              name
              price
              images {
                imageUrl
                isPrimary
              }
            }
          }
        }
      `;
    } else if (scenarioId === 'underfetching') {
      query = `
        query {
          products(first: 10) {
            nodes {
              id
              name
              description
              price
              images {
                imageUrl
                isPrimary
              }
              category {
                id
                name
                description
              }
              reviews {
                id
                rating
                comment
                createdAt
              }
            }
          }
        }
      `;
    } else if (scenarioId === 'nested') {
      query = `
        query {
          product(id: 1) {
            name
            description
            price
            images {
              imageUrl
            }
            category {
              name
              products {
                name
                price
              }
            }
            reviews {
              rating
              comment
              user {
                firstName
                lastName
              }
            }
          }
        }
      `;
    }

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    return result.data;
  };

  const getRestCode = (scenarioId: string): string => {
    if (scenarioId === 'overfetching') {
      return `GET /api/products?limit=10

// Returns ALL fields for each product:
// id, name, description, price, compareAtPrice,
// sku, stockQuantity, isActive, isFeatured, etc.`;
    } else if (scenarioId === 'underfetching') {
      return `// Request 1: Get products
GET /api/products?limit=10

// Requests 2-11: Get category for each product
GET /api/products/1/category
GET /api/products/2/category
... (8 more requests)

// Requests 12-21: Get reviews for each product
GET /api/products/1/reviews
GET /api/products/2/reviews
... (8 more requests)

// Total: 21 requests`;
    } else {
      return `// Request 1: Get product
GET /api/products/1

// Request 2: Get category
GET /api/categories/5

// Request 3: Get reviews
GET /api/products/1/reviews

// Requests 4-6: Get user for each review
GET /api/users/1
GET /api/users/2
GET /api/users/3

// Request 7: Get related products
GET /api/categories/5/products?limit=4

// Total: 7+ requests`;
    }
  };

  const getGraphQLCode = (scenarioId: string): string => {
    if (scenarioId === 'overfetching') {
      return `query {
  products(first: 10) {
    nodes {
      name
      price
      images {
        imageUrl
        isPrimary
      }
    }
  }
}

# Returns ONLY requested fields
# Total: 1 request`;
    } else if (scenarioId === 'underfetching') {
      return `query {
  products(first: 10) {
    nodes {
      id
      name
      description
      price
      images {
        imageUrl
        isPrimary
      }
      category {
        id
        name
        description
      }
      reviews {
        id
        rating
        comment
        createdAt
      }
    }
  }
}

# DataLoader batches category and review fetching
# Total: 1 request`;
    } else {
      return `query {
  product(id: 1) {
    name
    description
    price
    images { imageUrl }
    category {
      name
      products {
        name
        price
      }
    }
    reviews {
      rating
      comment
      user {
        firstName
        lastName
      }
    }
  }
}

# All nested data in one request
# Total: 1 request`;
    }
  };

  const resetResults = () => {
    setRestResult(null);
    setGraphqlResult(null);
    setError(null);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const calculateImprovement = (restValue: number, graphqlValue: number): number => {
    return Math.round(((restValue - graphqlValue) / restValue) * 100);
  };

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <div className="container">
          <h1>GraphQL vs REST Comparison</h1>
          <p>See the performance difference between GraphQL and REST APIs with real metrics</p>
        </div>
      </div>

      <div className="comparison-content">
        <div className="container">
          {/* Scenario Selector */}
          <div className="scenario-selector">
            <h3>Select Scenario</h3>
            <div className="scenario-buttons">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  className={`scenario-btn ${selectedScenario.id === scenario.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedScenario(scenario);
                    resetResults();
                  }}
                >
                  <div className="scenario-btn-title">{scenario.title}</div>
                  <div className="scenario-btn-desc">{scenario.description}</div>
                </button>
              ))}
            </div>

            {selectedScenario && (
              <div className="scenario-description">
                <h4>{selectedScenario.title}</h4>
                <p>{selectedScenario.fullDescription}</p>
              </div>
            )}

            <div className="options-row">
              <button
                className="run-test-btn"
                onClick={runTest}
                disabled={loading}
              >
                {loading ? 'Running Test...' : 'Run Test'}
              </button>
              <button
                className="reset-btn"
                onClick={resetResults}
                disabled={loading || (!restResult && !graphqlResult)}
              >
                Reset
              </button>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showDetails}
                  onChange={(e) => setShowDetails(e.target.checked)}
                />
                Show Request/Response Details
              </label>
            </div>
          </div>

          {error && (
            <div className="error-state">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {(loading || restResult || graphqlResult) && (
            <div className="results-container">
              {/* GraphQL Result */}
              <div className="api-result">
                <div className="api-result-header">
                  <h3>GraphQL API</h3>
                  <p>Single flexible endpoint</p>
                </div>
                <div className="api-result-body">
                  {loading && !graphqlResult ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Running GraphQL query...</p>
                    </div>
                  ) : graphqlResult ? (
                    <>
                      <div className="metrics-display">
                        <div className="metric-row">
                          <span className="metric-label">🔢 Requests</span>
                          <span className="metric-value">{graphqlResult.requestCount}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">⏱️ Response Time</span>
                          <span className="metric-value">{graphqlResult.responseTime}ms</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">📦 Payload Size</span>
                          <span className="metric-value">{formatBytes(graphqlResult.payloadSize)}</span>
                        </div>
                      </div>

                      {showDetails && (
                        <>
                          <div className="code-display">
                            <h4>Query Code</h4>
                            <div className="code-block">
                              <pre>{graphqlResult.code}</pre>
                            </div>
                          </div>
                          <div className="code-display">
                            <h4>Response Preview (first 500 chars)</h4>
                            <div className="code-block">
                              <pre>{graphqlResult.data ? JSON.stringify(graphqlResult.data, null, 2).substring(0, 500) + '...' : 'No data'}</pre>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              {/* REST Result */}
              <div className="api-result">
                <div className="api-result-header rest">
                  <h3>REST API</h3>
                  <p>Multiple resource endpoints</p>
                </div>
                <div className="api-result-body">
                  {loading && !restResult ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Running REST requests...</p>
                    </div>
                  ) : restResult ? (
                    <>
                      <div className="metrics-display">
                        <div className="metric-row">
                          <span className="metric-label">🔢 Requests</span>
                          <span className="metric-value">{restResult.requestCount}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">⏱️ Response Time</span>
                          <span className="metric-value">{restResult.responseTime}ms</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">📦 Payload Size</span>
                          <span className="metric-value">{formatBytes(restResult.payloadSize)}</span>
                        </div>
                      </div>

                      {showDetails && (
                        <>
                          <div className="code-display">
                            <h4>Request Code</h4>
                            <div className="code-block">
                              <pre>{restResult.code}</pre>
                            </div>
                          </div>
                          <div className="code-display">
                            <h4>Response Preview (first 500 chars)</h4>
                            <div className="code-block">
                              <pre>{restResult.data ? JSON.stringify(restResult.data, null, 2).substring(0, 500) + '...' : 'No data'}</pre>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Visualization */}
          {restResult && graphqlResult && (
            <div className="visualization-section">
              <h3>📊 Visual Comparison</h3>

              <div className="chart-container">
                <div className="chart-title">Request Count</div>
                <div className="bar-chart">
                  <div className="bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">GraphQL</span>
                      <span className="bar-value" style={{ color: '#667eea' }}>
                        {graphqlResult.requestCount} {graphqlResult.requestCount === 1 ? 'request' : 'requests'}
                      </span>
                    </div>
                    <div className="bar-background">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(graphqlResult.requestCount / Math.max(restResult.requestCount, graphqlResult.requestCount)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">REST</span>
                      <span className="bar-value" style={{ color: '#f5576c' }}>
                        {restResult.requestCount} requests
                      </span>
                    </div>
                    <div className="bar-background">
                      <div
                        className="bar-fill rest"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                {restResult.requestCount > graphqlResult.requestCount && (
                  <div className="improvement-badge">
                    {calculateImprovement(restResult.requestCount, graphqlResult.requestCount)}% fewer requests
                  </div>
                )}
              </div>

              <div className="chart-container">
                <div className="chart-title">Response Time</div>
                <div className="bar-chart">
                  <div className="bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">GraphQL</span>
                      <span className="bar-value" style={{ color: '#667eea' }}>
                        {graphqlResult.responseTime}ms
                      </span>
                    </div>
                    <div className="bar-background">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(graphqlResult.responseTime / Math.max(restResult.responseTime, graphqlResult.responseTime)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">REST</span>
                      <span className="bar-value" style={{ color: '#f5576c' }}>
                        {restResult.responseTime}ms
                      </span>
                    </div>
                    <div className="bar-background">
                      <div
                        className="bar-fill rest"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                {restResult.responseTime > graphqlResult.responseTime && (
                  <div className="improvement-badge">
                    {calculateImprovement(restResult.responseTime, graphqlResult.responseTime)}% faster
                  </div>
                )}
              </div>

              <div className="chart-container">
                <div className="chart-title">Payload Size</div>
                <div className="bar-chart">
                  <div className="bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">GraphQL</span>
                      <span className="bar-value" style={{ color: '#667eea' }}>
                        {formatBytes(graphqlResult.payloadSize)}
                      </span>
                    </div>
                    <div className="bar-background">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(graphqlResult.payloadSize / Math.max(restResult.payloadSize, graphqlResult.payloadSize)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">REST</span>
                      <span className="bar-value" style={{ color: '#f5576c' }}>
                        {formatBytes(restResult.payloadSize)}
                      </span>
                    </div>
                    <div className="bar-background">
                      <div
                        className="bar-fill rest"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                {restResult.payloadSize > graphqlResult.payloadSize && (
                  <div className="improvement-badge">
                    {calculateImprovement(restResult.payloadSize, graphqlResult.payloadSize)}% smaller payload
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
