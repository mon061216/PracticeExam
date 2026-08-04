import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudyMode from './pages/StudyMode';
import FixedPractice from './pages/FixedPractice';
import UntimedPractice from './pages/UntimedPractice';
import RandomPractice from './pages/RandomPractice';
import AutoStudyMode from './pages/AutoStudyMode';
import KeyboardHelp from './components/KeyboardHelp';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<StudyMode />} />
        <Route path="/practice-fixed" element={<FixedPractice />} />
        <Route path="/practice-untimed" element={<UntimedPractice />} />
        <Route path="/practice-random" element={<RandomPractice />} />
        <Route path="/auto-study" element={<AutoStudyMode />} />
      </Routes>
      <KeyboardHelp />
    </div>
  );
}

export default App;
