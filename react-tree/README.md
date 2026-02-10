# React Tree Structure

파일 탐색기 스타일의 React 트리 구조 컴포넌트

## 기능

- 폴더/파일 계층 구조 표시
- 폴더 확장/축소 기능
- 아이콘으로 파일 타입 구분
- 클릭 이벤트 처리
- 재사용 가능한 컴포넌트 구조

## 설치

```bash
npm install
```

## 실행

```bash
npm start
```

## 빌드

```bash
npm run build
```

## 사용법

```jsx
import Tree from './components/Tree';

const data = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'folder1',
      type: 'folder',
      children: [
        { name: 'file1.txt', type: 'file' }
      ]
    }
  ]
};

<Tree data={data} />
```
