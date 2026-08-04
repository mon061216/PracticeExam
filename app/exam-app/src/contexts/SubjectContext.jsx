import { createContext, useContext, useState, useEffect } from 'react';

const SubjectContext = createContext();

export function useSubject() {
  return useContext(SubjectContext);
}

export function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // VITE_API_URL should be set in .env or defaulting to localhost:5203
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5203/api';

  useEffect(() => {
    // Fetch subjects on mount
    fetch(`${apiUrl}/subjects`)
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubjectId(data[0].id); // default to first subject
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch subjects:', err);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (selectedSubjectId) {
      setLoading(true);
      fetch(`${apiUrl}/questions/${selectedSubjectId}`)
        .then(res => res.json())
        .then(data => {
            // Options and CorrectAnswers are stored as JSON strings in DB, we need to parse them
            const parsedData = data.map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                correctAnswers: typeof q.correctAnswers === 'string' ? JSON.parse(q.correctAnswers) : q.correctAnswers
            }));
            setQuestions(parsedData);
            setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch questions:', err);
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
