// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const finishEditBtn = document.querySelector("#finish-edit-btn");

const todoList = document.querySelector("#todo-list");

const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");

const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const initializeTodoList = () => {
  const todos = getTodosFromLocalStorage();

  if (!todos.length == 0) {
    const exampleTodos = document.querySelectorAll(".todo");

    exampleTodos.forEach((todo) => {
      const parentTodo = todo.closest("div");
      parentTodo.remove();
    });

    todos.forEach((todo) => {
      printTodo(todo);
    });
  }
};

const printTodo = (todo) => {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  if (todo.status === "done") {
    todoDiv.classList.add("done");
  }

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = todo.title;
  todoDiv.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todoDiv.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todoDiv.appendChild(editBtn);

  const deteleBtn = document.createElement("button");
  deteleBtn.classList.add("remove-todo");
  deteleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todoDiv.appendChild(deteleBtn);

  todoList.appendChild(todoDiv);
};

const saveTodo = (todoTitle) => {
  todoInput.value = "";

  const todo = {
    title: todoTitle,
  };

  printTodo(todo);
  addTodoToLocalStorage(todo);

  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
};

const updateTodo = (newTitle) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = newTitle;
    }
    updateTodoTitleToLocalStorage(newTitle);
  });
};

const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");
  const normalizedSearch = search.toLowerCase();

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = "flex";

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;

    if (targetEl.classList.contains("finish-todo")) {
      parentEl.classList.toggle("done");
      const updatedTodo = {
        title: todoTitle,
      };
      if (parentEl.classList.contains("done")) {
        updatedTodo.status = "done";
      } else {
        updatedTodo.status = "";
      }
      updateTodoStatusToLocalStorage(updatedTodo);
    }

    if (targetEl.classList.contains("remove-todo")) {
      removeTodoTitleFromLocalStorage(todoTitle);
      parentEl.remove();
    }

    if (targetEl.classList.contains("edit-todo")) {
      toggleForms();

      editInput.value = todoTitle;
      oldInputValue = todoTitle;
    } else {
      oldInputValue = "";
    }
  }
});

finishEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  editForm.dispatchEvent(new Event("submit"));
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }
  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// Local Storage
const getTodosFromLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};
initializeTodoList();

const saveTodosToLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const addTodoToLocalStorage = (todo) => {
  const todos = getTodosFromLocalStorage();
  todos.push(todo);
  saveTodosToLocalStorage(todos);
};

const updateTodoStatusToLocalStorage = (updatedTodo) => {
  const todos = getTodosFromLocalStorage();
  todos.forEach((todo) => {
    if (todo.title === updatedTodo.title) {
      todo.status = updatedTodo.status;
    }
  });
  saveTodosToLocalStorage(todos);
};

const updateTodoTitleToLocalStorage = (updatedTitle) => {
  const todos = getTodosFromLocalStorage();
  todos.forEach((todo) => {
    if (todo.title === oldInputValue) {
      todo.title = updatedTitle;
    }
  });
  saveTodosToLocalStorage(todos);
};

const removeTodoTitleFromLocalStorage = (todoTitle) => {
  const todos = getTodosFromLocalStorage();
  const newTodoList = [];
  todos.forEach((todo) => {
    if (!todo.title === todoTitle) {
      newTodoList.push(todo);
    }
  });
  console.log(newTodoList.length);
  saveTodosToLocalStorage(newTodoList);
};
