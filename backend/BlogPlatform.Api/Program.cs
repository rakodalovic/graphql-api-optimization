using BlogPlatform.Api.Data;
using BlogPlatform.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddBlogPlatformServices(builder.Configuration);

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Enable CORS
app.UseCors("AllowAll");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// GraphQL endpoint
app.MapGraphQL("/graphql");

// Seed database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    await SeedData.InitializeAsync(context);
}

// Configure for hosting
app.Urls.Add("http://0.0.0.0:12000");

app.Run();
