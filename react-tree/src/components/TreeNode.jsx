import React, { useState } from 'react';
import './TreeNode.css';

const TreeNode = ({ node, level = 0, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === 'folder';

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
        className={`tree-node-header ${isFolder ? 'folder' : 'file'}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
