import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

export default function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button 
        className="keyboard-help-btn"
        onClick={() => setIsOpen(true)}
        title="Xem phím tắt"
      >
        <Keyboard size={24} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-4">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Hướng dẫn Phím tắt</h2>
              <button className="btn-close" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="shortcut-section">
              <h3>1. Chế độ Học (Study Mode)</h3>
              <ul className="shortcut-list">
                <li><kbd>←</kbd> / <kbd>→</kbd> : Chuyển câu trước / sau</li>
                <li><kbd>↑</kbd> / <kbd>↓</kbd> : Di chuyển lên/xuống giữa các đáp án</li>
                <li><kbd>Enter</kbd> : Chọn đáp án đang được tô sáng</li>
                <li><kbd>1</kbd> - <kbd>5</kbd> hoặc <kbd>A</kbd> - <kbd>E</kbd> : Chọn nhanh đáp án tương ứng</li>
                <li><kbd>Space</kbd> : Mở đáp án và xem giải thích ngay</li>
              </ul>
            </div>

            <div className="shortcut-section mt-4">
              <h3>2. Học Tự Động (Auto Study Mode)</h3>
              <ul className="shortcut-list">
                <li><kbd>←</kbd> / <kbd>→</kbd> : Chuyển câu trước / sau</li>
                <li><kbd>Space</kbd> : Xem đáp án ngay (bỏ qua chờ)</li>
                <li><kbd>Enter</kbd> : Tạm dừng / Tiếp tục đếm ngược</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
