using Backend;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<CommentService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();

app.Urls.Add("http://0.0.0.0:5000");

app.UseRouting(); 

app.UseCors("ReactApp");



app.MapGet("/comments", (CommentService service) => service.GetAll());
app.MapGet("/comments/{id}", (CommentService service, int id) =>
    service.GetById(id) is { } comment ? Results.Ok(comment) : Results.NotFound());

app.MapPost("/comments", (CommentService service, Comment comment) =>
{
    var createdComment = service.Add(comment);
    return Results.Created($"/comments/{createdComment.Id}", createdComment);
});

// app.MapPatch("/comments/{id}", (CommentService service, int id, Comment comment) =>
//     service.Update(id, comment) is { } updated
//         ? Results.Ok(updated)
//         : Results.NotFound());

app.MapMethods("/comments/{id}", new[] { "PATCH" }, (CommentService service, int id, Comment comment) =>
    service.Update(id, comment) is { } updated
        ? Results.Ok(updated)
        : Results.NotFound());

app.MapDelete("/comments/{id}", (CommentService service, int id) =>
    service.Delete(id) ? Results.NoContent() : Results.NotFound());

if (app.Environment.IsProduction())
{
    app.UseStaticFiles();
    app.MapFallbackToFile("index.html");
}

app.Run();