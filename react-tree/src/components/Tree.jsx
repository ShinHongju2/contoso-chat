import React, { useState } from 'react';
import TreeNode from './TreeNode';
import ContextMenu from './ContextMenu';
import CreateModal from './CreateModal';
import ConfirmDialog from './ConfirmDialog';
import './Tree.css';

const Tree = ({ initialData, onNodeSelect }) => {
  const [treeData, setTreeData] = useState(initialData);
  const [selectedNode, setSelectedNode] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: null, node: null });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, node: null });
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOverNode, setDragOverNode] = useState(null);

  const handleSelect = (node) => {
    setSelectedNode(node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  const handleContextMenu = (e, node) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node
    });
  };

  const handleDragStart = (node) => {
    setDraggedNode(node);
  };

  const handleDragOver = (node) => {
    setDragOverNode(node);
  };

  const handleDrop = (targetNode) => {
    if (draggedNode && targetNode && draggedNode !== targetNode) {
      // 폴더에만 드롭 가능
      if (targetNode.type === 'folder') {
        moveNode(draggedNode, targetNode);
      }
    }
    setDraggedNode(null);
    setDragOverNode(null);
  };

  const findNodeById = (nodes, targetNode) => {
    for (let node of nodes) {
      if (node === targetNode) return { found: true, parent: null };
      if (node.children) {
        for (let child of node.children) {
          if (child === targetNode) return { found: true, parent: node };
          const result = findNodeById([child], targetNode);
          if (result.found) return result;
        }
      }
    }
    return { found: false, parent: null };
  };

  const moveNode = (sourceNode, targetFolder) => {
    const newData = JSON.parse(JSON.stringify(treeData));
    
    // 루트 children에서 찾기
    let sourceParent = null;
    const findAndRemove = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name === sourceNode.name) {
          const [removed] = nodes.splice(i, 1);
          return removed;
        }
        if (nodes[i].children) {
          const result = findAndRemove(nodes[i].children);
          if (result) return result;
        }
      }
      return null;
    };

    const removedNode = findAndRemove(newData.children || [newData]);
    
    if (removedNode) {
      // 대상 폴더 찾기
      const findAndAdd = (nodes) => {
        for (let node of nodes) {
          if (node.name === targetFolder.name && node.type === 'folder') {
            if (!node.children) node.children = [];
            node.children.push(removedNode);
            return true;
          }
          if (node.children) {
            if (findAndAdd(node.children)) return true;
          }
        }
        return false;
      };

      findAndAdd(newData.children || [newData]);
      setTreeData(newData);
    }
  };

  const createNode = (name, type) => {
    const newData = JSON.parse(JSON.stringify(treeData));
    const targetNode = modal.node;
    
    const newNode = {
      name,
      type,
      modified: 'just now',
      children: type === 'folder' ? [] : undefined
    };

    if (targetNode && targetNode.type === 'folder') {
      const addToFolder = (nodes) => {
        for (let node of nodes) {
          if (node.name === targetNode.name && node.type === 'folder') {
            if (!node.children) node.children = [];
            node.children.push(newNode);
            return true;
          }
          if (node.children) {
            if (addToFolder(node.children)) return true;
          }
        }
        return false;
      };
      
      addToFolder(newData.children || [newData]);
    } else {
      if (!newData.children) newData.children = [];
      newData.children.push(newNode);
    }
    
    setTreeData(newData);
    setModal({ isOpen: false, type: null, node: null });
  };

  const renameNode = (newName) => {
    const newData = JSON.parse(JSON.stringify(treeData));
    const targetNode = modal.node;
    
    const rename = (nodes) => {
      for (let node of nodes) {
        if (node.name === targetNode.name) {
          node.name = newName;
          return true;
        }
        if (node.children) {
          if (rename(node.children)) return true;
        }
      }
      return false;
    };
    
    rename(newData.children || [newData]);
    setTreeData(newData);
    setModal({ isOpen: false, type: null, node: null });
  };

  const deleteNode = () => {
    const newData = JSON.parse(JSON.stringify(treeData));
    const targetNode = confirmDialog.node;
    
    const remove = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name === targetNode.name) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children) {
          if (remove(nodes[i].children)) return true;
        }
      }
      return false;
    };
    
    remove(newData.children || [newData]);
    setTreeData(newData);
    setConfirmDialog({ isOpen: false, node: null });
  };

  return (
    <div className="tree-container">
      <div className="tree-header">
        <div className="tree-header-actions">
          <button 
            className="header-button" 
            title="새로 만들기"
            onClick={() => setModal({ isOpen: true, type: 'folder', node: null })}
          >
            +
          </button>
          <button 
            className="header-button" 
            title="새 파일"
            onClick={() => setModal({ isOpen: true, type: 'file', node: null })}
          >
            📄
          </button>
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
        {treeData && treeData.children ? (
          treeData.children.map((child, index) => (
            <TreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={0}
              onSelect={handleSelect}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              draggedNode={dragOverNode}
            />
          ))
        ) : (
          <TreeNode 
            node={treeData} 
            level={0} 
            onSelect={handleSelect}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            draggedNode={dragOverNode}
          />
        )}
      </div>

      {selectedNode && (
        <div className="tree-footer">
          선택됨: {selectedNode.name} ({selectedNode.type})
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          onNewFile={() => setModal({ isOpen: true, type: 'file', node: contextMenu.node })}
          onNewFolder={() => setModal({ isOpen: true, type: 'folder', node: contextMenu.node })}
          onRename={() => setModal({ isOpen: true, type: 'rename', node: contextMenu.node })}
          onDelete={() => setConfirmDialog({ isOpen: true, node: contextMenu.node })}
        />
      )}

      <CreateModal
        isOpen={modal.isOpen}
        type={modal.type}
        defaultName={modal.type === 'rename' ? modal.node?.name : ''}
        onClose={() => setModal({ isOpen: false, type: null, node: null })}
        onCreate={modal.type === 'rename' ? renameNode : (name) => createNode(name, modal.type)}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="삭제 확인"
        message={`정말로 "${confirmDialog.node?.name}"을(를) 삭제하시겠습니까?`}
        onConfirm={deleteNode}
        onCancel={() => setConfirmDialog({ isOpen: false, node: null })}
      />
    </div>
  );
};

export default Tree;
