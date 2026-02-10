import React, { useState, useEffect, useRef } from 'react';
import './CreateModal.css';

const CreateModal = ({ isOpen, type, onClose, onCreate, defaultName = '' }) => {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const title = type === 'file' ? '새 파일' : type === 'folder' ? '새 폴더' : '이름 바꾸기';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <input
              ref={inputRef}
              type="text"
              className="modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={type === 'file' ? '파일 이름을 입력하세요' : '폴더 이름을 입력하세요'}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-button cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-button confirm" disabled={!name.trim()}>
              {type === 'rename' ? '변경' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
