# 📋 Todo 앱 프롬프트 및 설계 문서

## 1. 원본 프롬프트

> Vanilla JavaScript로 Todo 앱을 만들려고 합니다.
>
> 코드를 바로 작성하지 말고,  
> 화면 구조, 데이터 구조, 필요한 함수 목록을 먼저 설계해 주세요.
>
> 조건:  
> - 초보자 기준  
> - HTML/CSS/JS 파일 기준 (Tailwind CDN을 사용)  
> - addTodo, renderTodos, toggleTodo, deleteTodo, updateCount() 포함

> 추가 요청 1: 맨 밑에 상태요약 내용도 있어야해. UI를 다시 짜줘

> 추가 요청 2: 진행 내용을 git에 기록해줘(프롬프트 포함)

> 추가 요청 3: 변수명을 최대한 명확하게 하고 함수는 최소한의 단위로 나눠서 사용해줘

---

## 2. 파일 구조

```
todolist/
├── index.html    ← 화면 구조 (Tailwind CDN 포함)
├── style.css     ← 커스텀 스타일 (완료 취소선, 체크박스, 호버)
├── app.js        ← 전체 로직
└── PROMPT.md     ← 이 문서
```

---

## 3. 화면 구조 (UI Layout)

```
┌─────────────────────────────────────┐
│           📝 My Todo List            │  ← 제목 (h1)
├─────────────────────────────────────┤
│  [할 일을 입력하세요...]  [+ 추가]    │  ← 입력 영역
├─────────────────────────────────────┤
│                                     │
│  ☐  할 일 1                    [🗑] │
│  ☑  ~~할 일 2~~  (취소선 스타일) [🗑] │  ← 할 일 목록
│  ☐  할 일 3                    [🗑] │
│                                     │
├─────────────────────────────────────┤
│  📊 상태 요약                        │
│                                     │
│  전체: 3개   완료: 1개   미완료: 2개  │
│                                     │
│  진행률  ████░░░░░░░░  33%          │
└─────────────────────────────────────┘
```

### HTML 요소 매핑

| 역할 | 요소 / ID |
|------|-----------|
| 할 일 입력창 | `<input id="todoInput">` |
| 할 일 목록 | `<ul id="todoList">` |
| 빈 목록 안내 | `<p id="emptyMsg">` |
| 전체 카운트 | `<span id="totalCount">` |
| 완료 카운트 | `<span id="doneCount">` |
| 미완료 카운트 | `<span id="remainCount">` |
| 진행 바 | `<div id="progressBar">` |
| 진행률 텍스트 | `<p id="progressText">` |

---

## 4. 데이터 구조

```js
// 개별 Todo 객체
{
  id:   1748654321000, // 고유 ID (Date.now() 활용)
  text: "공부하기",    // 할 일 내용 (string)
  done: false          // 완료 여부 (boolean)
}

// 전체 할 일 목록
let todoItemList = [
  { id: 1748654321000, text: "공부하기", done: false },
  { id: 1748654321001, text: "운동하기", done: true  },
];
```

---

## 5. 함수 구조

### 🔧 유틸리티 함수 (Utility Functions)

| 함수명 | 역할 |
|--------|------|
| `getTodoInputElement()` | 입력창 DOM 요소 반환 |
| `getInputText()` | 입력창 텍스트 값 반환 (공백 제거) |
| `clearInputText()` | 입력창 텍스트 초기화 |
| `focusInputElement()` | 입력창에 포커스 이동 |
| `generateUniqueId()` | 고유 ID 생성 (Date.now) |
| `createTodoObject(todoText)` | 새 할 일 객체 생성 |
| `findTodoById(targetId)` | id로 할 일 항목 검색 |

### 🖥️ DOM 조작 함수 (DOM Helper Functions)

| 함수명 | 역할 |
|--------|------|
| `clearTodoListElement()` | 목록 영역(ul) 비우기 |
| `showEmptyMessage()` | 빈 목록 안내 메시지 표시 |
| `hideEmptyMessage()` | 빈 목록 안내 메시지 숨김 |
| `createTodoListItem(todoItem)` | 단일 할 일 `<li>` 요소 생성 |
| `appendAllTodoItems()` | 모든 할 일을 목록에 추가 |

### 📊 상태 계산 함수 (Count & Progress Functions)

| 함수명 | 역할 |
|--------|------|
| `countDoneTodos()` | 완료된 할 일 개수 반환 |
| `calculateProgressPercent(total, done)` | 진행률(%) 계산 |
| `renderCountNumbers(total, done, remain)` | 카운트 숫자를 화면에 반영 |
| `renderProgressBar(percent)` | 진행 바와 텍스트를 화면에 반영 |

### 🎯 핵심 기능 함수 (Core Functions)

| 함수명 | 역할 |
|--------|------|
| `addTodo()` | 입력창 값을 읽어 새 할 일 추가 |
| `renderTodos()` | 배열 기반으로 화면 목록 전체 갱신 |
| `toggleTodo(targetId)` | done 상태 true ↔ false 전환 |
| `deleteTodo(targetId)` | 해당 id 항목을 배열에서 제거 |
| `updateCount()` | 상태 요약 영역 전체 업데이트 |

---

## 6. 함수 호출 흐름

```
[+ 추가 버튼 / Enter 키]
    └→ addTodo()
          ├→ getInputText()
          ├→ createTodoObject()
          │     └→ generateUniqueId()
          ├→ clearInputText()
          ├→ focusInputElement()
          └→ renderTodos()
                ├→ clearTodoListElement()
                ├→ showEmptyMessage() 또는
                │   hideEmptyMessage()
                │   appendAllTodoItems()
                │       └→ createTodoListItem()
                └→ updateCount()
                      ├→ countDoneTodos()
                      ├→ calculateProgressPercent()
                      ├→ renderCountNumbers()
                      └→ renderProgressBar()

[체크박스 클릭]
    └→ toggleTodo(targetId) → renderTodos() → updateCount()

[🗑 삭제 버튼]
    └→ deleteTodo(targetId) → renderTodos() → updateCount()
```
