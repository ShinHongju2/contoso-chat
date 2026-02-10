# React Tree Structure

파일 탐색기 스타일의 React 트리 구조 컴포넌트

## 기능

### 기본 기능
- 폴더/파일 계층 구조 표시
- 폴더 확장/축소 기능
- 아이콘으로 파일 타입 구분
- 클릭 이벤트 처리
- 재사용 가능한 컴포넌트 구조

### 마우스 인터랙션
- **우클릭 컨텍스트 메뉴**: 파일/폴더에서 우클릭하여 작업 수행
  - 새 파일 생성
  - 새 폴더 생성
  - 이름 바꾸기
  - 삭제
- **드래그 앤 드롭**: 파일/폴더를 드래그하여 다른 폴더로 이동
- **모달 대화상자**: 파일/폴더 생성 및 이름 변경
- **삭제 확인 다이얼로그**: 삭제 전 확인 요청

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
        { name: 'file1.txt', type: 'file', modified: '1 hour ago' }
      ]
    }
  ]
};

const handleNodeSelect = (node) => {
  console.log('Selected:', node);
};

<Tree initialData={data} onNodeSelect={handleNodeSelect} />
```

## 인터랙션 가이드

### 파일/폴더 생성
1. 상단 버튼(+ 또는 📄)을 클릭하여 루트에 생성
2. 폴더에 우클릭 → "새 파일" 또는 "새 폴더" 선택

### 파일/폴더 이동
- 파일/폴더를 드래그하여 대상 폴더 위에 드롭

### 이름 변경
- 파일/폴더에 우클릭 → "이름 바꾸기" 선택

### 삭제
- 파일/폴더에 우클릭 → "삭제" 선택 → 확인
