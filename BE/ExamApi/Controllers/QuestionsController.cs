using ExamApi.Data;
using ExamApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Questions/5
        [HttpGet("{subjectId}")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions(int subjectId)
        {
            return await _context.Questions
                .Where(q => q.SubjectId == subjectId)
                .OrderBy(q => q.Id)
                .ToListAsync();
        }
    }
}
