import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ResultScreen from '../components/ResultScreen';

const QUESTIONS_PER_EXAM = 60;
const EXAM_DURATION = 40; // minutes

export default function FixedPractice() {
  const navigate = useNavigate();
  const { questions: questionsData, loading } = useSubject();
  const [selectedExam, setSelectedExam] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const numExams = Math.ceil(questionsData.length / QUESTIONS_PER_EXAM);
  
  const currentQuestions = useMemo(() => {
    if (selectedExam === null) return [];
    const start = selectedExam * QUESTIONS_PER_EXAM;
    return questionsData.slice(start, start + QUESTIONS_PER_EXAM);
  }, [selectedExam]);

  const handleAnswerChange = (index, answers) => {
    setUserAnswers({ ...userAnswers, [index]: answers });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="p-4 text-center">Đang tải câu hỏi...</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div className="p-4 text-center">Không có dữ liệu câu hỏi cho môn học này.</div>;
  }

  if (selectedExam === null) {
    return (
      <div>
        <div className="flex-between mb-4">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Quay lại
          </button>
        </div>
        
        <h2 className="title text-center mb-4">Chọn Đề Luyện Tập</h2>
        <div className="menu-grid">
          {Array.from({ length: numExams }).map((_, i) => (
            <div key={i} className="menu-card" onClick={() => {
              setSelectedExam(i);
              setUserAnswers({});
              setIsSubmitted(false);
            }}>
              <h3 className="menu-title">Đề {i + 1}</h3>
              <p className="text-muted">Câu {i * QUESTIONS_PER_EXAM + 1} đến {Math.min((i + 1) * QUESTIONS_PER_EXAM, questionsData.length)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <ResultScreen 
        questions={currentQuestions} 
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
        <button className="btn btn-secondary" onClick={() => setSelectedExam(null)}>
          <ArrowLeft size={20} /> Đổi đề
        </button>
        
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          Đề {selectedExam + 1}
        </div>
        
        <Timer initialMinutes={EXAM_DURATION} onTimeUp={handleSubmit} />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {currentQuestions.map((q, index) => (
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
