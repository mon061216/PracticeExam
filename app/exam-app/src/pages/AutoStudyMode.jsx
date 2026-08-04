import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { useSubject } from '../contexts/SubjectContext';

export default function AutoStudyMode() {
  const navigate = useNavigate();
  const { questions: questionsData, loading } = useSubject();
  const [timeQuestionConfig, setTimeQuestionConfig] = useState(20);
  const [timeAnswerConfig, setTimeAnswerConfig] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('READING_QUESTION'); // 'READING_QUESTION' | 'READING_ANSWER'
  const [timeLeft, setTimeLeft] = useState(timeQuestionConfig);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time is up, transition state
          if (mode === 'READING_QUESTION') {
            setMode('READING_ANSWER');
            return timeAnswerConfig;
          } else {
            // Next question
            if (currentIndex < questionsData.length - 1) {
              setCurrentIndex(c => c + 1);
              setMode('READING_QUESTION');
              return timeQuestionConfig;
            } else {
              // Reached the end
              setIsPaused(true);
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, mode, currentIndex, timeQuestionConfig, timeAnswerConfig]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setMode('READING_QUESTION');
      setTimeLeft(timeQuestionConfig);
    }
  };

  const goToNext = () => {
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setMode('READING_QUESTION');
      setTimeLeft(timeQuestionConfig);
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const showAnswerNow = () => {
    if (mode === 'READING_QUESTION') {
      setMode('READING_ANSWER');
      setTimeLeft(timeAnswerConfig);
      setIsPaused(false); // Ensure it's playing so it counts down the answer time
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === ' ') {
        e.preventDefault();
        showAnswerNow();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, mode]);

  if (loading) {
    return <div className="p-4 text-center">Đang tải câu hỏi...</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div className="p-4 text-center">Không có dữ liệu câu hỏi cho môn học này.</div>;
  }

  const question = questionsData[currentIndex];
  const showFeedback = mode === 'READING_ANSWER';

  return (
    <div>
      <div className="flex-between mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Quay lại
          </button>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Học Tự Động
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Đọc câu hỏi (s):
            <input 
              type="number" 
              value={timeQuestionConfig} 
              onChange={e => setTimeQuestionConfig(Math.max(1, Number(e.target.value) || 1))} 
              style={{ width: '60px', marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border)' }} 
            />
          </label>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Xem đáp án (s):
            <input 
              type="number" 
              value={timeAnswerConfig} 
              onChange={e => setTimeAnswerConfig(Math.max(1, Number(e.target.value) || 1))} 
              style={{ width: '60px', marginLeft: '0.5rem', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border)' }} 
            />
          </label>
        </div>
      </div>

      <div className="study-layout">
        <div className="main-content">
          <div className="flex-between mb-4 card" style={{ padding: '1rem', position: 'sticky', top: '1rem', zIndex: 10 }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>Câu {currentIndex + 1} / {questionsData.length}</span>
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.9rem', 
                color: mode === 'READING_QUESTION' ? 'var(--warning)' : 'var(--success)' 
              }}>
                {mode === 'READING_QUESTION' ? 'Đang đọc câu hỏi...' : 'Đang xem đáp án'}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {mode === 'READING_QUESTION' && (
                <button 
                  className="btn btn-secondary" 
                  onClick={showAnswerNow}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Xem đáp án
                </button>
              )}
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
                {timeLeft}s
              </div>
              <button 
                className={`btn ${isPaused ? 'btn' : 'btn-secondary'}`} 
                onClick={togglePause}
              >
                {isPaused ? <><Play size={20} /> Tiếp tục</> : <><Pause size={20} /> Tạm dừng</>}
              </button>
            </div>
          </div>

          <QuestionCard
            key={question.id + mode} // force re-render for animation if needed
            question={question}
            index={currentIndex}
            userAnswers={showFeedback ? question.correctAnswers : []} // Show correct answers visually when in answer mode
            onAnswerChange={() => {}} // Disabled interaction
            showFeedback={showFeedback}
            hideSelectionUI={true}
          />

          <div className="flex-between mt-4">
            <button 
              className="btn" 
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={20} /> Câu trước
            </button>
            
            <button 
              className="btn" 
              onClick={goToNext}
              disabled={currentIndex === questionsData.length - 1}
            >
              Câu tiếp <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="sidebar">
          <h3 className="mb-4" style={{ textAlign: 'center' }}>Danh sách câu hỏi</h3>
          <div className="question-nav-grid">
            {questionsData.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setMode('READING_QUESTION');
                    setTimeLeft(timeQuestionConfig);
                  }}
                  title={`Câu ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
