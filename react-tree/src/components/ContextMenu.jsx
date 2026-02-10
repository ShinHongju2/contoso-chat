import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

const ContextMenu = ({ x, y, node, onClose, onNewFile, onNewFolder, onRename, onDelete }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = (action) => {
    action();
    onClose();
  };

  const isFolder = node?.type === 'folder';

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: y, left: x }}
    >
      {isFolder && (
        <>
          <div className="context-menu-item" onClick={() => handleAction(onNewFile)}>
            <span className="menu-icon">📄</span>
            새 파일
          </div>
          <div className="context-menu-item" onClick={() => handleAction(onNewFolder)}>
            <span className="menu-icon">📁</span>
            새 폴더
          </div>
          <div className="context-menu-divider"></div>
        </>
      )}
      <div className="context-menu-item" onClick={() => handleAction(onRename)}>
        <span className="menu-icon">✏️</span>
        이름 바꾸기
      </div>
      <div className="context-menu-divider"></div>
      <div className="context-menu-item danger" onClick={() => handleAction(onDelete)}>
        <span className="menu-icon">🗑️</span>
        삭제
      </div>
    </div>
  );
};

export default ContextMenu;
