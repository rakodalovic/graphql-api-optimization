using System.Text.Json;
using HotChocolate;
using HotChocolate.Language;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL.Scalars;

public class JsonType : ScalarType<JsonElement, StringValueNode>
{
    public JsonType() : base("JSON")
    {
        Description = "A valid JSON object or value for flexible structured data";
    }

    public override IValueNode ParseResult(object? resultValue)
    {
        if (resultValue is null)
        {
            return NullValueNode.Default;
        }

        if (resultValue is JsonElement jsonElement)
        {
            return new StringValueNode(JsonSerializer.Serialize(jsonElement));
        }

        if (resultValue is string jsonString)
        {
            return new StringValueNode(jsonString);
        }

        // Try to serialize any object to JSON
        try
        {
            var serialized = JsonSerializer.Serialize(resultValue);
            return new StringValueNode(serialized);
        }
        catch (Exception)
        {
            throw new SerializationException(
                "Cannot serialize the given value to JSON.",
                this);
        }
    }

    public override bool TrySerialize(object? runtimeValue, out object? resultValue)
    {
        if (runtimeValue is null)
        {
            resultValue = null;
            return true;
        }

        if (runtimeValue is JsonElement jsonElement)
        {
            resultValue = JsonSerializer.Serialize(jsonElement);
            return true;
        }

        if (runtimeValue is string jsonString)
        {
            if (IsValidJson(jsonString))
            {
                resultValue = jsonString;
                return true;
            }
        }

        // Try to serialize any object to JSON
        try
        {
            resultValue = JsonSerializer.Serialize(runtimeValue);
            return true;
        }
        catch (Exception)
        {
            resultValue = null;
            return false;
        }
    }

    public override bool TryDeserialize(object? resultValue, out object? runtimeValue)
    {
        if (resultValue is null)
        {
            runtimeValue = null;
            return true;
        }

        if (resultValue is string jsonString)
        {
            if (IsValidJson(jsonString))
            {
                try
                {
                    runtimeValue = JsonSerializer.Deserialize<JsonElement>(jsonString);
                    return true;
                }
                catch (Exception)
                {
                    runtimeValue = null;
                    return false;
                }
            }
        }

        runtimeValue = null;
        return false;
    }

    protected override JsonElement ParseLiteral(StringValueNode valueSyntax)
    {
        var jsonString = valueSyntax.Value;
        
        if (!IsValidJson(jsonString))
        {
            throw new SerializationException(
                $"The given value '{jsonString}' is not valid JSON.",
                this);
        }

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(jsonString);
        }
        catch (JsonException ex)
        {
            throw new SerializationException(
                $"The given value '{jsonString}' is not valid JSON: {ex.Message}",
                this);
        }
    }

    protected override StringValueNode ParseValue(JsonElement runtimeValue)
    {
        try
        {
            var jsonString = JsonSerializer.Serialize(runtimeValue);
            return new StringValueNode(jsonString);
        }
        catch (Exception ex)
        {
            throw new SerializationException(
                $"Cannot serialize JsonElement to string: {ex.Message}",
                this);
        }
    }

    private static bool IsValidJson(string jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString))
            return false;

        try
        {
            JsonDocument.Parse(jsonString);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }
}