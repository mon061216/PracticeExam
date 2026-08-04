using Microsoft.EntityFrameworkCore;
using ExamApi.Models;

namespace ExamApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Question> Questions { get; set; }
}
