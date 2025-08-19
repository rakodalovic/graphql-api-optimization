using System.Text.RegularExpressions;
using HotChocolate;
using HotChocolate.Language;
using HotChocolate.Types;

namespace GraphQLApi.GraphQL.Scalars;

public class EmailType : ScalarType<string, StringValueNode>
{
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public EmailType() : base("Email")
    {
        Description = "A valid email address format";
    }

    public override IValueNode ParseResult(object? resultValue)
    {
        if (resultValue is null)
        {
            return NullValueNode.Default;
        }

        if (resultValue is string email)
        {
            return new StringValueNode(email);
        }

        throw new SerializationException(
            "Cannot serialize the given value to an Email.",
            this);
    }

    public override bool TrySerialize(object? runtimeValue, out object? resultValue)
    {
        if (runtimeValue is null)
        {
            resultValue = null;
            return true;
        }

        if (runtimeValue is string email)
        {
            if (IsValidEmail(email))
            {
                resultValue = email;
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

        if (resultValue is string email)
        {
            if (IsValidEmail(email))
            {
                runtimeValue = email;
                return true;
            }
        }

        runtimeValue = null;
        return false;
    }

    protected override string ParseLiteral(StringValueNode valueSyntax)
    {
        var email = valueSyntax.Value;
        
        if (!IsValidEmail(email))
        {
            throw new SerializationException(
                $"The given value '{email}' is not a valid email address.",
                this);
        }

        return email;
    }

    protected override StringValueNode ParseValue(string runtimeValue)
    {
        if (!IsValidEmail(runtimeValue))
        {
            throw new SerializationException(
                $"The given value '{runtimeValue}' is not a valid email address.",
                this);
        }

        return new StringValueNode(runtimeValue);
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        if (email.Length > 254) // RFC 5321 limit
            return false;

        return EmailRegex.IsMatch(email);
    }
}