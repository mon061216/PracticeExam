import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, Infinity, Shuffle, PlayCircle } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';

export default function Home() {
  const navigate = useNavigate();
  const { subjects, selectedSubjectId, setSelectedSubjectId } = useSubject();

  return (
    <div>
      <div className="header">
        <h1 className="title">Luyện Thi FE</h1>
        <p className="subtitle">Chọn một môn học và chế độ để bắt đầu luyện tập</p>
      </div>

      {subjects.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
            <span style={{ fontWeight: 'bold' }}>Môn học:</span>
            <select 
              value={selectedSubjectId || ''} 
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="menu-grid">
        <div className="menu-card" onClick={() => navigate('/study')}>
          <BookOpen className="menu-icon" size={32} />
          <h2 className="menu-title">Chế độ Học (Study Mode)</h2>
          <p className="text-muted">Làm từng câu, xem đáp án và giải thích ngay lập tức. Tổng hợp toàn bộ câu hỏi.</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/auto-study')}>
          <PlayCircle className="menu-icon" size={32} />
          <h2 className="menu-title">Học Tự Động (Auto Study)</h2>
          <p className="text-muted">Tự động đọc câu hỏi (20s) và giải thích (30s). Giúp học thụ động, rảnh tay.</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/practice-fixed')}>
          <Target className="menu-icon" size={32} />
          <h2 className="menu-title">Luyện Đề (Fixed Practice)</h2>
          <p className="text-muted">Làm các đề thi cố định (60 câu/đề) trong 40 phút. Biết kết quả sau khi nộp bài.</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/practice-untimed')}>
          <Infinity className="menu-icon" size={32} />
          <h2 className="menu-title">Luyện Không Giới Hạn</h2>
          <p className="text-muted">Không tính thời gian, nhưng phải làm xong tất cả mới được xem kết quả.</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/practice-random')}>
          <Shuffle className="menu-icon" size={32} />
          <h2 className="menu-title">Đề Ngẫu Nhiên (Random)</h2>
          <p className="text-muted">Đề thi tạo ngẫu nhiên 60 câu, thời gian làm bài 30 phút.</p>
        </div>
      </div>
    </div>
  );
}
