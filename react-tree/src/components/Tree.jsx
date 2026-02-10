import React, { useState } from 'react';
import TreeNode from './TreeNode';
import './Tree.css';

const Tree = ({ data, onNodeSelect }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleSelect = (node) => {
    setSelectedNode(node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  return (
    <div className="tree-container">
      <div className="tree-header">
        <div className="tree-header-actions">
          <button className="header-button" title="새로 만들기">+</button>
          <button className="header-button" title="새 파일">📄</button>
          <button className="header-button" title="새로고침">🔄</button>
          <button className="header-button" title="필터">🔍</button>
        </div>
      </div>
      
      <div className="tree-breadcrumb">
        <span className="breadcrumb-item">/ ... / 10samples / crawling2 /</span>
      </div>

      <div className="tree-list-header">
        <div className="header-column name-column">Name ▲</div>
        <div className="header-column modified-column">Modified</div>
      </div>

      <div className="tree-content">
        {data && data.children ? (
          data.children.map((child, index) => (
            <TreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={0}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <TreeNode node={data} level={0} onSelect={handleSelect} />
        )}
      </div>

      {selectedNode && (
        <div className="tree-footer">
          선택됨: {selectedNode.name} ({selectedNode.type})
        </div>
      )}
    </div>
  );
};

export default Tree;
