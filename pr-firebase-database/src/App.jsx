import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "./features/todo/thunk";
import { clearMessage } from "./features/todo/todoSlice";

const App = () => {
  const [todo, setTodo] = useState({});
  const dispatch = useDispatch();

  const {
    todos,
    loading,
    formLoading,
    deleteLoadingId,
    message,
    error,
  } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(getAllTodos());
  }, []);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearMessage()), 2000);
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    todo.id ? dispatch(updateTodo(todo)) : dispatch(createTodo(todo));
    setTodo({});
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-bold text-teal-600">
        Loading Todos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      {/* MESSAGE */}
      {message && (
        <div className="max-w-md mx-auto mb-4 text-center bg-green-100 text-green-700 py-2 rounded-lg shadow">
          {message}
        </div>
      )}

      {/* FORM */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          Todo App
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            value={todo.text || ""}
            onChange={(e) =>
              setTodo({ ...todo, text: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-green-400"
            placeholder="Enter todo..."
          />

          <button
            disabled={formLoading}
            className={`w-full py-2 rounded-xl text-white font-bold
              ${formLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
            `}
          >
            {formLoading
              ? "Processing..."
              : todo.id
              ? "Update Todo"
              : "Add Todo"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Todo</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((t, i) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{t.text}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => setTodo(t)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => dispatch(deleteTodo(t.id))}
                    disabled={deleteLoadingId === t.id}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {deleteLoadingId === t.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <p className="text-center text-red-600 mt-4">{error}</p>
      )}
    </div>
  );
};

export default App;
