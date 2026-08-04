export default function QuestionCard({ 
  question, 
  index, 
  userAnswers = [], 
  onAnswerChange, 
  showFeedback = false,
  focusedOptionIndex = -1,
  hideSelectionUI = false
}) {
  const isMulti = question.correctAnswers.length > 1;

  const handleOptionClick = (letter) => {
    if (showFeedback) return; // Prevent changing after submission/in study mode when feedback is shown
    
    if (isMulti) {
      if (userAnswers.includes(letter)) {
        onAnswerChange(userAnswers.filter(a => a !== letter));
      } else {
        onAnswerChange([...userAnswers, letter]);
      }
    } else {
      onAnswerChange([letter]);
    }
  };

  return (
    <div className="card">
      <h3 className="title" style={{ fontSize: '1.2rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
        Câu {index + 1}: {question.text}
      </h3>

      {/* Special images for specific questions */}
      {([226, 231, 232, 233].includes(question.id)) && (
        <img 
          src={`/images/${question.id}.png`} 
          alt={`Minh hoạ cho câu ${question.id}`} 
          className="question-image" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div style={{ marginTop: '1rem' }}>
        {question.options.map((opt, i) => {
          const match = opt.match(/^([A-Z])\./);
          const letter = match ? match[1] : String.fromCharCode(65 + i);
          const isSelected = userAnswers.includes(letter);
          const isCorrect = question.correctAnswers.includes(letter);
          
          let statusClass = '';
          if (showFeedback) {
            if (isCorrect) statusClass = 'correct';
            else if (isSelected && !isCorrect) statusClass = 'incorrect';
          }

          return (
            <div 
              key={i}
              className={`option ${isSelected ? 'selected' : ''} ${statusClass} ${(showFeedback || hideSelectionUI) ? 'disabled' : ''} ${focusedOptionIndex === i ? 'focused' : ''}`}
              onClick={() => hideSelectionUI ? null : handleOptionClick(letter)}
              style={hideSelectionUI ? { cursor: 'default' } : {}}
            >
              {!hideSelectionUI && (
                <input 
                  type={isMulti ? 'checkbox' : 'radio'}
                  className="option-checkbox"
                  checked={isSelected}
                  readOnly
                />
              )}
              <span>{opt}</span>
            </div>
          );
        })}
      </div>

      {showFeedback && question.explanation && (
        <div className="explanation">
          <strong>Giải thích:</strong>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
