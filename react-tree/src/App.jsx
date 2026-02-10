import React from 'react';
import Tree from './components/Tree';
import './App.css';

// 예제 데이터 - 이미지에 보이는 구조를 재현
const sampleData = {
  name: 'crawling2',
  type: 'folder',
  children: [
    {
      name: 'markdown',
      type: 'folder',
      modified: '1 hour ago',
      children: [
        {
          name: 'article1.md',
          type: 'file',
          modified: '1 hour ago'
        },
        {
          name: 'article2.md',
          type: 'file',
          modified: '1 hour ago'
        }
      ]
    },
    {
      name: 'processes',
      type: 'folder',
      modified: '1 hour ago',
      children: [
        {
          name: 'scraper.py',
          type: 'file',
          modified: '30 minutes ago'
        },
        {
          name: 'parser.py',
          type: 'file',
          modified: '45 minutes ago'
        }
      ]
    },
    {
      name: 'agents.py',
      type: 'file',
      modified: '28 minutes ago'
    },
    {
      name: 'check-json-files.ipynb',
      type: 'file',
      modified: 'yesterday'
    },
    {
      name: 'main.ipynb',
      type: 'file',
      modified: '22 minutes ago'
    },
    {
      name: 'main.py',
      type: 'file',
      modified: 'yesterday'
    },
    {
      name: 'prompts.py',
      type: 'file',
      modified: '2 hours ago'
    },
    {
      name: 'sites.google.com-view-skjung-peo...json',
      type: 'file',
      modified: '22 minutes ago'
    },
    {
      name: 'sites.google.com-view-skjung-peo...html',
      type: 'file',
      modified: '22 minutes ago'
    },
    {
      name: 'sites.google.com-view-skjung-peo...txt',
      type: 'file',
      modified: '22 minutes ago'
    },
    {
      name: 'view.ipynb',
      type: 'file',
      modified: '19 minutes ago'
    }
  ]
};

function App() {
  const handleNodeSelect = (node) => {
    console.log('선택된 노드:', node);
  };

  return (
    <div className="app">
      <Tree data={sampleData} onNodeSelect={handleNodeSelect} />
    </div>
  );
}

export default App;
