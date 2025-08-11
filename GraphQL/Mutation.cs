using HotChocolate;

namespace GraphQLApi.GraphQL;

public class Mutation
{
    /// <summary>
    /// Echo mutation that returns the input message
    /// </summary>
    /// <param name="message">Message to echo</param>
    /// <returns>Echo response</returns>
    public EchoPayload Echo(string message)
    {
        return new EchoPayload
        {
            Message = message,
            Timestamp = DateTime.UtcNow,
            Success = true
        };
    }

    /// <summary>
    /// Simple calculation mutation
    /// </summary>
    /// <param name="a">First number</param>
    /// <param name="b">Second number</param>
    /// <param name="operation">Operation to perform</param>
    /// <returns>Calculation result</returns>
    public CalculationPayload Calculate(double a, double b, CalculationOperation operation = CalculationOperation.Add)
    {
        double result = operation switch
        {
            CalculationOperation.Add => a + b,
            CalculationOperation.Subtract => a - b,
            CalculationOperation.Multiply => a * b,
            CalculationOperation.Divide => b != 0 ? a / b : throw new GraphQLException("Division by zero is not allowed"),
            _ => throw new GraphQLException("Invalid operation")
        };

        return new CalculationPayload
        {
            Result = result,
            Operation = operation,
            InputA = a,
            InputB = b,
            Success = true
        };
    }
}

public record EchoPayload
{
    public string Message { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; }
    public bool Success { get; init; }
}

public record CalculationPayload
{
    public double Result { get; init; }
    public CalculationOperation Operation { get; init; }
    public double InputA { get; init; }
    public double InputB { get; init; }
    public bool Success { get; init; }
}

public enum CalculationOperation
{
    Add,
    Subtract,
    Multiply,
    Divide
}