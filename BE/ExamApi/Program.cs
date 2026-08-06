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

    // Seed Software Testing
    var swtSubject = db.Subjects.FirstOrDefault(s => s.Name == "Software Testing");
    if (swtSubject == null)
    {
        swtSubject = new Subject { Name = "Software Testing" };
        db.Subjects.Add(swtSubject);
        db.SaveChanges();
    }

    if (!db.Questions.Any(q => q.SubjectId == swtSubject.Id))
    {
        var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "questions.json");
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
                        SubjectId = swtSubject.Id,
                        Text = q.Text,
                        Options = JsonSerializer.Serialize(q.Options),
                        CorrectAnswers = JsonSerializer.Serialize(q.CorrectAnswers),
                        Explanation = q.Explanation
                    });
                }
                db.SaveChanges();
                Console.WriteLine("Successfully seeded Software Testing questions.");
            }
        }
    }

    // Seed SWR302
    var swrSubject = db.Subjects.FirstOrDefault(s => s.Name == "SWR302");
    if (swrSubject == null)
    {
        swrSubject = new Subject { Name = "SWR302" };
        db.Subjects.Add(swrSubject);
        db.SaveChanges();
    }

    if (!db.Questions.Any(q => q.SubjectId == swrSubject.Id))
    {
        var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "swr302_questions.json");
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
                        SubjectId = swrSubject.Id,
                        Text = q.Text,
                        Options = JsonSerializer.Serialize(q.Options),
                        CorrectAnswers = JsonSerializer.Serialize(q.CorrectAnswers),
                        Explanation = q.Explanation
                    });
                }
                db.SaveChanges();
                Console.WriteLine("Successfully seeded SWR302 questions.");
            }
        }
    }

    // Seed PRN212
    var prnSubject = db.Subjects.FirstOrDefault(s => s.Name.StartsWith("PRN212"));
    if (prnSubject == null)
    {
        prnSubject = new Subject { Name = "PRN212: Basic Cross-Platform Application Programming With .NET" };
        db.Subjects.Add(prnSubject);
        db.SaveChanges();
    }

    var existingPrnQuestions = db.Questions.Where(q => q.SubjectId == prnSubject.Id).ToList();
    if (existingPrnQuestions.Any())
    {
        db.Questions.RemoveRange(existingPrnQuestions);
        db.SaveChanges();
        Console.WriteLine("Cleared previous PRN212 questions to sync updated explanations.");
    }

    if (!db.Questions.Any(q => q.SubjectId == prnSubject.Id))
    {
        var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "prn212_questions.json");
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
                        SubjectId = prnSubject.Id,
                        Text = q.Text,
                        Options = JsonSerializer.Serialize(q.Options),
                        CorrectAnswers = JsonSerializer.Serialize(q.CorrectAnswers),
                        Explanation = q.Explanation
                    });
                }
                db.SaveChanges();
                Console.WriteLine("Successfully seeded PRN212 questions.");
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
