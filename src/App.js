// App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [showTodoBoxes, setShowTodoBoxes] = useState(false);
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("not completed");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchTodos();
  }, [filterStatus]);

  const fetchTodos = () => {
    axios
      .get("http://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos", error);
      });
  };

  const addTodo = () => {
    axios
      .post("http://jsonplaceholder.typicode.com/todos", {
        task,
        description,
        status,
      })
      .then((response) => {
        setTodos([...todos, response.data]);
        setTask("");
        setDescription("");
        setShowTodoBoxes(true);
      })
      .catch((error) => {
        console.error("Error adding todo", error);
      });
  };

  const updateTodo = (id, newStatus) => {
    axios
      .patch(`http://jsonplaceholder.typicode.com/todos/${id}`, {
        status: newStatus,
      })
      .then(() => {
        fetchTodos();
      })
      .catch((error) => {
        console.error("Error updating todo", error);
      });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        fetchTodos();
      })
      .catch((error) => {
        console.error("Error deleting todo", error);
      });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === "all") {
      return true;
    } else {
      return todo.status === filterStatus;
    }
  });

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div>
        <input
          type="text"
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {showTodoBoxes && (
        <div>
          <label>Filter Status:</label>
          <select
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setShowTodoBoxes(false); // Reset showTodoBoxes when changing filter
            }}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="not completed">Not Completed</option>
          </select>

          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <div className="todo-item">
                  <div>
                    <strong>{todo.task}</strong>
                    <p>{todo.description}</p>
                  </div>
                  <div>
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                    <select
                      className="status-dropdown"
                      value={todo.status}
                      onChange={(e) => updateTodo(todo.id, e.target.value)}
                    >
                      <option value="completed">Completed</option>
                      <option value="not completed">Not Completed</option>
                    </select>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
