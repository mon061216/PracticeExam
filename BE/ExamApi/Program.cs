using ExamApi.Models;
using ExamApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EF Core with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS to allow the React app to connect
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Seed data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Subjects.Any())
    {
        var subject = new Subject { Name = "Software Testing" };
        db.Subjects.Add(subject);
        db.SaveChanges();

        // Read from the frontend directory for seeding
        var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "app", "exam-app", "src", "data", "questions.json");
        if (File.Exists(jsonPath))
        {
            var json = File.ReadAllText(jsonPath);
            var questionsData = JsonSerializer.Deserialize<List<QuestionData>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            if (questionsData != null)
            {
                foreach (var q in questionsData)
                {
                    db.Questions.Add(new Question
                    {
                        SubjectId = subject.Id,
                        Text = q.Text,
                        Options = JsonSerializer.Serialize(q.Options),
                        CorrectAnswers = JsonSerializer.Serialize(q.CorrectAnswers),
                        Explanation = q.Explanation
                    });
                }
                db.SaveChanges();
            }
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

// Helper class for seeding
class QuestionData
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public List<string> CorrectAnswers { get; set; } = new();
    public string? Explanation { get; set; }
}
