import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { useSubject } from '../contexts/SubjectContext';

export default function StudyMode() {
  const navigate = useNavigate();
  const { questions: questionsData, loading } = useSubject();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [checkedStates, setCheckedStates] = useState({});
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);

  // Reset focus when changing question
  useEffect(() => {
    setFocusedOptionIndex(0);
  }, [currentIndex]);

  const handleAnswerChange = useCallback((answers) => {
    setUserAnswers(prev => ({ ...prev, [currentIndex]: answers }));
    
    // Only auto-check immediately if it's a single choice question
    if (questionsData && questionsData.length > 0) {
        const isMulti = questionsData[currentIndex].correctAnswers.length > 1;
        if (!isMulti) {
          setCheckedStates(prev => ({ ...prev, [currentIndex]: true }));
        }
    }
  }, [currentIndex, questionsData]);

  if (loading) {
    return <div className="p-4 text-center">Đang tải câu hỏi...</div>;
  }

  if (!questionsData || questionsData.length === 0) {
    return <div className="p-4 text-center">Không có dữ liệu câu hỏi cho môn học này.</div>;
  }

  const question = questionsData[currentIndex];
  const isChecked = !!checkedStates[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(questionsData.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedOptionIndex(prev => Math.min(question.options.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedOptionIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!isChecked) {
          const letter = String.fromCharCode(65 + focusedOptionIndex);
          const currentAns = userAnswers[currentIndex] || [];
          const isMulti = question.correctAnswers.length > 1;
          
          let newAns;
          if (isMulti) {
            if (currentAns.includes(letter)) {
              newAns = currentAns.filter(a => a !== letter);
            } else {
              newAns = [...currentAns, letter];
            }
          } else {
            newAns = [letter];
          }
          handleAnswerChange(newAns);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        // Space to reveal answer if not yet answered
        if (!isChecked) {
          setCheckedStates(prev => ({ ...prev, [currentIndex]: true }));
        }
      } else if (['1','2','3','4','5'].includes(e.key) || ['a','b','c','d','e'].includes(e.key.toLowerCase())) {
        if (!isChecked) {
          const indexMapping = {
            '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
            'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4
          };
          const optIndex = indexMapping[e.key.toLowerCase()];
          if (optIndex !== undefined && optIndex < question.options.length) {
            const letter = String.fromCharCode(65 + optIndex);
            const currentAns = userAnswers[currentIndex] || [];
            const isMulti = question.correctAnswers.length > 1;
            
            let newAns;
            if (isMulti) {
              if (currentAns.includes(letter)) {
                newAns = currentAns.filter(a => a !== letter);
              } else {
                newAns = [...currentAns, letter];
              }
            } else {
              newAns = [letter];
            }
            handleAnswerChange(newAns);
            setFocusedOptionIndex(optIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isChecked, question, userAnswers, focusedOptionIndex, handleAnswerChange]);

  return (
    <div>
      <div className="flex-between mb-4">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Chế độ Học (Study Mode)
        </div>
      </div>

      <div className="study-layout">
        <div className="main-content">
          <div className="flex-between mb-4 card" style={{ padding: '1rem', position: 'sticky', top: '1rem', zIndex: 10 }}>
            <span style={{ fontWeight: 'bold' }}>Câu {currentIndex + 1} / {questionsData.length}</span>
          </div>

          <QuestionCard
            key={question.id}
            question={question}
            index={currentIndex}
            userAnswers={userAnswers[currentIndex] || []}
            onAnswerChange={handleAnswerChange}
            showFeedback={isChecked}
            focusedOptionIndex={focusedOptionIndex}
          />

          {!isChecked && question.correctAnswers.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setCheckedStates(prev => ({ ...prev, [currentIndex]: true }))}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white' }}
              >
                <Check size={20} /> Kiểm tra đáp án
              </button>
            </div>
          )}

          <div className="flex-between mt-4">
            <button 
              className="btn" 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={20} /> Câu trước
            </button>
            
            <button 
              className="btn" 
              onClick={() => setCurrentIndex(prev => Math.min(questionsData.length - 1, prev + 1))}
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
              const hasAnswered = userAnswers[idx] && userAnswers[idx].length > 0;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  className={`nav-btn ${isActive ? 'active' : ''} ${hasAnswered && !isActive ? 'answered' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
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
