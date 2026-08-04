import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ResultScreen from '../components/ResultScreen';

const EXAM_DURATION = 30; // minutes
const QUESTIONS_PER_EXAM = 60;

export default function RandomPractice() {
  const navigate = useNavigate();
  const { questions: questionsData, loading } = useSubject();
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Randomly select 60 questions on component mount
  const randomQuestions = useMemo(() => {
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, QUESTIONS_PER_EXAM);
  }, []);

  const handleAnswerChange = (index, answers) => {
    setUserAnswers({ ...userAnswers, [index]: answers });
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải câu hỏi...</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div className="p-4 text-center">Không có dữ liệu câu hỏi cho môn học này.</div>;
  }

  const handleSubmit = () => {
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (isSubmitted) {
    return (
      <ResultScreen 
        questions={randomQuestions} 
        userAnswers={userAnswers} 
        onRetry={() => {
          // A full reload or state reset to generate new questions could be done, 
          // but for simplicity, navigating away and back generates a new random set
          navigate(0); // refresh the route to get new random questions
        }}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  return (
    <div>
      <div className="flex-between mb-4 card" style={{ position: 'sticky', top: '1rem', zIndex: 10, padding: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Thoát
        </button>
        
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          Đề Ngẫu Nhiên
        </div>
        
        <Timer initialMinutes={EXAM_DURATION} onTimeUp={handleSubmit} />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {randomQuestions.map((q, index) => (
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

      <div className="text-center">
        <button className="btn" onClick={handleSubmit} style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
          Nộp Bài
        </button>
      </div>
    </div>
  );
}
