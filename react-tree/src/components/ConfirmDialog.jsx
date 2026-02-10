import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
        </div>
        <div className="dialog-footer">
          <button className="dialog-button cancel" onClick={onCancel}>
            취소
          </button>
          <button className="dialog-button confirm danger" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
