namespace ExamApi.Models;

public class Question
{
    public int Id { get; set; }
    
    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    
    public string Text { get; set; } = string.Empty;
    
    // We can store options and correct answers as JSON strings in the database 
    // to keep it simple, similar to how it was in questions.json
    public string Options { get; set; } = "[]"; 
    
    public string CorrectAnswers { get; set; } = "[]";
    
    public string? Explanation { get; set; }
}
