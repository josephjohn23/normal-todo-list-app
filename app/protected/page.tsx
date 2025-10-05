"use client"; // Client Component because we use state, effects, and localStorage

import { useEffect, useMemo, useState } from "react"; // React hooks for state, memoization, and effects

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

// Key used to persist the list in the browser's localStorage
const STORAGE_KEY = "protected_todos";

export default function ProtectedPage() {
  // Initialize todos from localStorage (only in the browser)
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as Todo[]) : [];
    } catch {
      // If JSON parsing fails or storage is unavailable, start with an empty list
      return [];
    }
  });
  // Controlled input for the add-todo field
  const [inputValue, setInputValue] = useState("");
  // Which todos to show in the list
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Persist to localStorage when todos change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore quota/storage errors
    }
  }, [todos]);

  // Number of tasks that are not completed (recomputed when todos change)
  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  // Create a new todo from the input value
  function addTodo() {
    const text = inputValue.trim();
    if (!text) return; // Ignore empty submissions
    const newTodo: Todo = {
      id: crypto.randomUUID(), // Unique id for list rendering and updates
      text,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInputValue("");
  }

  // Flip a todo's completed status by id
  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  // Remove a todo by id
  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  // Remove all completed todos
  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  // Derive the visible list from the selected filter
  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <div className="protected-bg flex flex-col items-center">
      <div className="container-narrow">
        <h1 className="page-title" style={{ marginBottom: 16 }}>
          Protected Content
        </h1>
        <div className="glass-card" style={{ padding: 20 }}>
          <p style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
            This page should only be accessible to authenticated users.
          </p>
          <div className="row gap-8" style={{ marginBottom: 14 }}>
            <input
              className="input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="Add a new task"
            />
            <button className="btn" onClick={addTodo}>
              Add
            </button>
          </div>

          <div className="toolbar" style={{ marginBottom: 14 }}>
            <div className="muted">
              {todos.length === 0 ? (
                <span>No tasks yet. Add your first one above.</span>
              ) : (
                <span>
                  {remainingCount} remaining of {todos.length}
                </span>
              )}
            </div>
            <div className="row gap-12">
              <div className="filters">
                <button className={`chip ${filter === "all" ? "chip-active" : ""}`} onClick={() => setFilter("all")}>
                  All
                </button>
                <button
                  className={`chip ${filter === "active" ? "chip-active" : ""}`}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`chip ${filter === "completed" ? "chip-active" : ""}`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>
              <button className="btn btn-ghost" onClick={clearCompleted} disabled={todos.every((t) => !t.completed)}>
                Clear Completed
              </button>
            </div>
          </div>

          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li key={todo.id} className="todo-item fade-in">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ width: 18, height: 18 }}
                />
                <span className={`todo-text ${todo.completed ? "completed" : ""}`}>{todo.text}</span>
                <button className="btn btn-ghost" onClick={() => deleteTodo(todo.id)} aria-label="Delete task">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
