using HotChocolate;
using HotChocolate.Language;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL.Scalars;

public class UrlType : ScalarType<string, StringValueNode>
{
    public UrlType() : base("URL")
    {
        Description = "A valid URL format with proper validation and formatting";
    }

    public override IValueNode ParseResult(object? resultValue)
    {
        if (resultValue is null)
        {
            return NullValueNode.Default;
        }

        if (resultValue is string url)
        {
            return new StringValueNode(url);
        }

        throw new SerializationException(
            "Cannot serialize the given value to a URL.",
            this);
    }

    public override bool TrySerialize(object? runtimeValue, out object? resultValue)
    {
        if (runtimeValue is null)
        {
            resultValue = null;
            return true;
        }

        if (runtimeValue is string url)
        {
            if (IsValidUrl(url))
            {
                resultValue = FormatUrl(url);
                return true;
            }
        }

        resultValue = null;
        return false;
    }

    public override bool TryDeserialize(object? resultValue, out object? runtimeValue)
    {
        if (resultValue is null)
        {
            runtimeValue = null;
            return true;
        }

        if (resultValue is string url)
        {
            if (IsValidUrl(url))
            {
                runtimeValue = FormatUrl(url);
                return true;
            }
        }

        runtimeValue = null;
        return false;
    }

    protected override string ParseLiteral(StringValueNode valueSyntax)
    {
        var url = valueSyntax.Value;
        
        if (!IsValidUrl(url))
        {
            throw new SerializationException(
                $"The given value '{url}' is not a valid URL.",
                this);
        }

        return FormatUrl(url);
    }

    protected override StringValueNode ParseValue(string runtimeValue)
    {
        if (!IsValidUrl(runtimeValue))
        {
            throw new SerializationException(
                $"The given value '{runtimeValue}' is not a valid URL.",
                this);
        }

        return new StringValueNode(FormatUrl(runtimeValue));
    }

    private static bool IsValidUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return false;

        if (url.Length > 2048) // Common URL length limit
            return false;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
               (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private static string FormatUrl(string url)
    {
        if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return uri.ToString();
        }
        
        return url;
    }
}