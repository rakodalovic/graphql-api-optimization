using BlogPlatform.Api.Models;

namespace BlogPlatform.Api.Services;

public interface IAuthService
{
    Task<string?> AuthenticateAsync(string username, string password);
    Task<User?> GetUserByIdAsync(int userId);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User> RegisterAsync(string username, string email, string password, string role = "User");
    string GenerateJwtToken(User user);
    int? GetUserIdFromToken(string token);
}