import React, { useState } from 'react';
import './TreeNode.css';

const TreeNode = ({ 
  node, 
  level = 0, 
  onSelect, 
  onContextMenu,
  onDragStart,
  onDragOver,
  onDrop,
  draggedNode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === 'folder';
  const isDraggedOver = draggedNode && draggedNode !== node;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isFolder) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(node);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e, node);
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(node);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) {
      onDragOver(node);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDrop) {
      onDrop(node);
    }
  };

  const getIcon = () => {
    if (isFolder) {
      return isExpanded ? '📂' : '📁';
    }
    
    // 파일 확장자에 따른 아이콘
    const extension = node.name.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return '📜';
      case 'json':
        return '📋';
      case 'py':
        return '🐍';
      case 'ipynb':
        return '📓';
      case 'md':
        return '📝';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      default:
        return '📄';
    }
  };

  return (
    <div className="tree-node">
      <div
        className={`tree-node-header ${isFolder ? 'folder' : 'file'} ${isDraggedOver ? 'drag-over' : ''}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        draggable={true}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isFolder && (
          <span className="toggle-icon" onClick={handleToggle}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {!isFolder && <span className="toggle-icon-placeholder"></span>}
        <span className="node-icon">{getIcon()}</span>
        <span className="node-name">{node.name}</span>
        {node.modified && (
          <span className="node-modified">{node.modified}</span>
        )}
      </div>
      
      {isFolder && isExpanded && hasChildren && (
        <div className="tree-node-children">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              draggedNode={draggedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
