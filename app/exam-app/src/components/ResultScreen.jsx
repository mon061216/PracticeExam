import QuestionCard from './QuestionCard';

export default function ResultScreen({ questions, userAnswers, onRetry, onBackToHome }) {
  let correctCount = 0;

  questions.forEach((q, index) => {
    const userAns = userAnswers[index] || [];
    const correctAns = q.correctAnswers || [];
    
    // Check if arrays have same elements
    if (userAns.length === correctAns.length && 
        userAns.every(v => correctAns.includes(v))) {
      correctCount++;
    }
  });

  return (
    <div>
      <div className="card text-center" style={{ marginBottom: '2rem' }}>
        <h2 className="title">Kết Quả Bài Làm</h2>
        <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
          Bạn đã trả lời đúng <strong style={{ color: 'var(--success)' }}>{correctCount}</strong> / {questions.length} câu.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn" onClick={onRetry}>Làm lại đề này</button>
          <button className="btn btn-secondary" onClick={onBackToHome}>Về trang chủ</button>
        </div>
      </div>

      <h3 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Chi tiết đáp án:</h3>
      
      {questions.map((q, index) => (
        <QuestionCard 
          key={q.id}
          question={q}
          index={index}
          userAnswers={userAnswers[index] || []}
          showFeedback={true}
        />
      ))}
    </div>
  );
}
