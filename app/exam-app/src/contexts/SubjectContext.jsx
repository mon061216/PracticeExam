import { createContext, useContext, useState, useEffect } from 'react';
import swtQuestionsData from '../data/questions.json';
import swrQuestionsData from '../data/swr302_questions.json';
import prnQuestionsData from '../data/prn212_questions.json';
import wduQuestionsData from '../data/wdu_questions.json';

const SubjectContext = createContext();

export function useSubject() {
  return useContext(SubjectContext);
}

const FALLBACK_SUBJECTS = [
  { id: 1, name: "Software Testing" },
  { id: 2, name: "SWR302" },
  { id: 3, name: "PRN212: Basic Cross-Platform Application Programming With .NET" },
  { id: 4, name: "WDU: Web Design & Usability" }
];

const FALLBACK_QUESTIONS = {
  1: swtQuestionsData,
  2: swrQuestionsData,
  3: prnQuestionsData,
  4: wduQuestionsData
};

export function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState(FALLBACK_SUBJECTS);
  const [selectedSubjectId, setSelectedSubjectId] = useState(1);
  const [questions, setQuestions] = useState(swtQuestionsData);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5203/api';

  useEffect(() => {
    fetch(`${apiUrl}/subjects`)
      .then(res => {
        if (!res.ok) throw new Error('API response not ok');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setSubjects(data);
          setSelectedSubjectId(data[0].id);
        }
      })
      .catch(err => {
        console.warn('API unavailable, using fallback static data:', err);
        setSubjects(FALLBACK_SUBJECTS);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (selectedSubjectId) {
      setLoading(true);
      fetch(`${apiUrl}/questions/${selectedSubjectId}`)
        .then(res => {
          if (!res.ok) throw new Error('API response not ok');
          return res.json();
        })
        .then(data => {
          const parsedData = data.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correctAnswers: typeof q.correctAnswers === 'string' ? JSON.parse(q.correctAnswers) : q.correctAnswers
          }));
          setQuestions(parsedData);
          setLoading(false);
        })
        .catch(err => {
          console.warn('API fetch questions failed, using static fallback:', err);
          const fallback = FALLBACK_QUESTIONS[selectedSubjectId] || FALLBACK_QUESTIONS[4] || [];
          setQuestions(fallback);
          setLoading(false);
        });
    }
  }, [selectedSubjectId, apiUrl]);

  return (
    <SubjectContext.Provider value={{ 
        subjects, 
        selectedSubjectId, 
        setSelectedSubjectId, 
        questions, 
        loading 
    }}>
      {children}
    </SubjectContext.Provider>
  );
}
