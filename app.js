// =============================================
// 📦 데이터: 할 일 목록 배열
// =============================================
let todoItemList = []; // 전체 할 일 항목을 담는 배열

// localStorage에 사용할 키 이름 (상수)
const STORAGE_KEY      = "todoItemList";
const DARK_MODE_KEY    = "darkMode";       // 다크모드 설정 저장 키


// =============================================
// 💾 localStorage 함수 (Storage Functions)
// - 데이터를 브라우저에 저장하고 불러오는 함수들
// =============================================

/** todoItemList 배열을 localStorage에 저장 */
function saveTodoListToStorage() {
  // 배열을 JSON 문자열로 변환하여 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItemList));
}

/** localStorage에서 할 일 목록을 불러와 todoItemList에 적용 */
function loadTodoListFromStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  // 저장된 데이터가 있으면 JSON 파싱, 없으면 빈 배열 사용
  todoItemList = savedData ? JSON.parse(savedData) : [];
}

/** 현재 다크모드 활성 여부를 localStorage에 저장 */
function saveDarkModeToStorage(isDarkMode) {
  localStorage.setItem(DARK_MODE_KEY, isDarkMode);
}

/** localStorage에서 다크모드 설정을 불러와 화면에 적용 */
function loadDarkModeFromStorage() {
  const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);

  // 저장된 값이 "true"이면 다크모드 적용
  if (savedDarkMode === "true") {
    applyDarkMode();
  } else {
    applyLightMode();
  }
}

/** <html> 요소에 dark 클래스를 추가하여 다크모드 활성화 */
function applyDarkMode() {
  document.documentElement.classList.add("dark");
  document.getElementById("darkModeToggleBtn").textContent = "☀️"; // 버튼 아이콘: 해(라이트 전환 안내)
}

/** <html> 요소에서 dark 클래스를 제거하여 라이트모드 활성화 */
function applyLightMode() {
  document.documentElement.classList.remove("dark");
  document.getElementById("darkModeToggleBtn").textContent = "🌙"; // 버튼 아이콘: 달(다크 전환 안내)
}

/** 현재 모드를 확인하여 다크/라이트를 전환하는 함수 */
function toggleDarkMode() {
  const isDarkModeActive = document.documentElement.classList.contains("dark");

  if (isDarkModeActive) {
    applyLightMode();
    saveDarkModeToStorage(false);
  } else {
    applyDarkMode();
    saveDarkModeToStorage(true);
  }
}


// =============================================
// 🔧 유틸리티 함수 (Utility Functions)
// - DOM 요소를 가져오거나 입력값을 처리하는 작은 단위 함수들
// =============================================

/** 할 일 입력창 DOM 요소를 반환 */
function getTodoInputElement() {
  return document.getElementById("todoInput");
}

/** 입력창의 현재 텍스트 값을 반환 (앞뒤 공백 제거) */
function getInputText() {
  return getTodoInputElement().value.trim();
}

/** 입력창 텍스트를 비움 */
function clearInputText() {
  getTodoInputElement().value = "";
}

/** 입력창에 포커스를 이동 */
function focusInputElement() {
  getTodoInputElement().focus();
}

/** 고유 ID를 생성 (현재 밀리초 시간 활용) */
function generateUniqueId() {
  return Date.now();
}

/** 새 할 일 객체를 생성하여 반환 */
function createTodoObject(todoText) {
  return {
    id:   generateUniqueId(), // 고유 ID
    text: todoText,           // 할 일 내용
    done: false               // 초기 완료 상태: 미완료
  };
}

/** id로 일치하는 할 일 항목을 배열에서 찾아 반환 */
function findTodoById(targetId) {
  return todoItemList.find(function (todoItem) {
    return todoItem.id === targetId;
  });
}


// =============================================
// 🖥️ DOM 조작 함수 (DOM Helper Functions)
// - 화면 요소를 직접 변경하는 함수들
// =============================================

/** 할 일 목록 영역(ul)을 비움 */
function clearTodoListElement() {
  document.getElementById("todoList").innerHTML = "";
}

/** "할 일 없음" 안내 메시지를 화면에 표시 */
function showEmptyMessage() {
  document.getElementById("emptyMsg").classList.remove("hidden");
}

/** "할 일 없음" 안내 메시지를 화면에서 숨김 */
function hideEmptyMessage() {
  document.getElementById("emptyMsg").classList.add("hidden");
}

/** 단일 할 일 항목의 <li> DOM 요소를 생성하여 반환 */
function createTodoListItem(todoItem) {
  const listItemElement = document.createElement("li");
  listItemElement.className =
    "todo-item flex items-center gap-3 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 transition";

  // 완료 여부에 따라 텍스트 스타일 클래스 결정 (라이트/다크 모두 적용)
  const textStyleClass = todoItem.done
    ? "todo-done"
    : "text-gray-700 dark:text-gray-200";

  listItemElement.innerHTML = `
    <input
      type="checkbox"
      ${todoItem.done ? "checked" : ""}
      onchange="toggleTodo(${todoItem.id})"
    />
    <span class="flex-1 text-sm ${textStyleClass}">
      ${todoItem.text}
    </span>
    <button
      onclick="deleteTodo(${todoItem.id})"
      class="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-base transition"
      title="삭제"
    >
      🗑
    </button>
  `;

  return listItemElement;
}

/** 할 일 목록 <ul>에 모든 항목 <li>를 추가 */
function appendAllTodoItems() {
  const todoListElement = document.getElementById("todoList");

  todoItemList.forEach(function (todoItem) {
    const listItemElement = createTodoListItem(todoItem);
    todoListElement.appendChild(listItemElement);
  });
}


// =============================================
// 📊 상태 계산 함수 (Count & Progress Functions)
// - 카운트/진행률을 계산하고 화면에 반영하는 함수들
// =============================================

/** 완료된 할 일의 개수를 반환 */
function countDoneTodos() {
  return todoItemList.filter(function (todoItem) {
    return todoItem.done === true;
  }).length;
}

/** 진행률(%)을 계산하여 반환 (전체가 0이면 0 반환) */
function calculateProgressPercent(totalCount, doneCount) {
  if (totalCount === 0) return 0;
  return Math.round((doneCount / totalCount) * 100);
}

/** 전체/완료/미완료 카운트 숫자를 화면에 반영 */
function renderCountNumbers(totalCount, doneCount, remainCount) {
  document.getElementById("totalCount").textContent  = totalCount;
  document.getElementById("doneCount").textContent   = doneCount;
  document.getElementById("remainCount").textContent = remainCount;
}

/** 진행률 바와 퍼센트 텍스트를 화면에 반영 */
function renderProgressBar(progressPercent) {
  document.getElementById("progressBar").style.width     = progressPercent + "%";
  document.getElementById("progressText").textContent    = "진행률: " + progressPercent + "%";
}


// =============================================
// 🎯 핵심 기능 함수 (Core Functions)
// - 실제 Todo 앱의 주요 동작을 담당
// =============================================

/**
 * ➕ addTodo
 * 입력창의 텍스트를 읽어 새 할 일을 todoItemList에 추가하고 화면을 갱신
 */
function addTodo() {
  const inputText = getInputText();

  // 빈 값이면 추가 중단
  if (inputText === "") {
    alert("할 일을 입력해 주세요!");
    focusInputElement();
    return;
  }

  const newTodoItem = createTodoObject(inputText);
  todoItemList.push(newTodoItem);

  saveTodoListToStorage(); // 변경된 목록을 localStorage에 저장
  clearInputText();
  focusInputElement();
  renderTodos();
}

/**
 * 🖥️ renderTodos
 * todoItemList 배열을 기반으로 화면 목록 전체를 다시 그림
 */
function renderTodos() {
  clearTodoListElement();

  if (todoItemList.length === 0) {
    showEmptyMessage();
  } else {
    hideEmptyMessage();
    appendAllTodoItems();
  }

  updateCount();
}

/**
 * ✅ toggleTodo
 * 특정 id의 할 일 완료 상태(done)를 true ↔ false 로 전환하고 화면을 갱신
 */
function toggleTodo(targetId) {
  todoItemList = todoItemList.map(function (todoItem) {
    if (todoItem.id === targetId) {
      return { ...todoItem, done: !todoItem.done }; // done 반전
    }
    return todoItem;
  });

  saveTodoListToStorage(); // 변경된 목록을 localStorage에 저장
  renderTodos();
}

/**
 * 🗑️ deleteTodo
 * 특정 id의 할 일을 todoItemList에서 제거하고 화면을 갱신
 */
function deleteTodo(targetId) {
  todoItemList = todoItemList.filter(function (todoItem) {
    return todoItem.id !== targetId; // 해당 id만 제외
  });

  saveTodoListToStorage(); // 변경된 목록을 localStorage에 저장
  renderTodos();
}

/**
 * 📊 updateCount
 * 전체/완료/미완료 카운트와 진행률을 계산하여 상태 요약 영역을 업데이트
 */
function updateCount() {
  const totalCount    = todoItemList.length;
  const doneCount     = countDoneTodos();
  const remainCount   = totalCount - doneCount;
  const progressPercent = calculateProgressPercent(totalCount, doneCount);

  renderCountNumbers(totalCount, doneCount, remainCount);
  renderProgressBar(progressPercent);
}


// =============================================
// ⌨️ 이벤트 리스너: Enter 키로 할 일 추가 지원
// =============================================
getTodoInputElement().addEventListener("keydown", function (keyboardEvent) {
  if (keyboardEvent.key === "Enter") {
    addTodo();
  }
});


// =============================================
// 🚀 앱 초기 실행: localStorage에서 데이터 불러온 뒤 화면 렌더링
// =============================================
loadDarkModeFromStorage(); // 저장된 다크모드 설정 불러오기
loadTodoListFromStorage(); // 저장된 할 일 목록 불러오기
renderTodos();             // 화면에 출력
