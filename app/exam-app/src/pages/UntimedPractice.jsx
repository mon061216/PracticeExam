import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';
import QuestionCard from '../components/QuestionCard';
import ResultScreen from '../components/ResultScreen';

export default function UntimedPractice() {
  const navigate = useNavigate();
  const { questions: questionsData, loading } = useSubject();
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (index, answers) => {
    setUserAnswers({ ...userAnswers, [index]: answers });
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải câu hỏi...</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div className="p-4 text-center">Không có dữ liệu câu hỏi cho môn học này.</div>;
  }

  const isAllAnswered = Object.keys(userAnswers).length === questionsData.length && 
    Object.values(userAnswers).every(ans => ans.length > 0);

  const handleSubmit = () => {
    if (!isAllAnswered) {
      alert('Bạn phải trả lời tất cả các câu hỏi mới được xem kết quả!');
      return;
    }
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (isSubmitted) {
    return (
      <ResultScreen 
        questions={questionsData} 
        userAnswers={userAnswers} 
        onRetry={() => {
          setUserAnswers({});
          setIsSubmitted(false);
        }}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  return (
    <div>
      <div className="flex-between mb-4 card" style={{ position: 'sticky', top: '1rem', zIndex: 10, padding: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Quay lại
        </button>
        
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          Đã làm: {Object.keys(userAnswers).filter(k => userAnswers[k].length > 0).length} / {questionsData.length}
        </div>
        
        <button 
          className="btn" 
          onClick={handleSubmit} 
          disabled={!isAllAnswered}
        >
          Nộp Bài
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {questionsData.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={index}
            userAnswers={userAnswers[index] || []}
            onAnswerChange={(ans) => handleAnswerChange(index, ans)}
            showFeedback={false}
          />
        ))}
      </div>
    </div>
  );
}
