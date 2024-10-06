"use client"; // Next.js 13에서 클라이언트 컴포넌트를 사용하기 위한 선언

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Todo 항목에 대한 타입 정의
type Todo = {
  id: number;
  task: string;
  is_complete: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    fetchTodos(); // 컴포넌트가 마운트될 때 할 일 목록 불러오기
  }, []);

  // Read: Fetch todos from Supabase
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log('Error fetching todos:', error);
    } else if (data) {
      setTodos(data as Todo[]);
    }
  };

  // Create: Insert new todo into Supabase
  const addTodo = async () => {
    if (newTask.trim()) {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: newTask, is_complete: false }]);

      if (error) {
        console.log('Error adding task:', error);
      } else if (data) {
        setTodos([...todos, ...(data as Todo[])]);
        setNewTask(''); // 입력창 비우기
      }
    } else {
      console.log('Task is empty');
    }
  };

  // Update: Toggle completion status of todo
  const toggleComplete = async (id: number, isComplete: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !isComplete }) // 완료 여부 반전
      .eq('id', id);

    if (error) {
      console.log('Error updating task:', error);
    } else {
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, is_complete: !isComplete } : todo)));
    }
  };

  // Delete: Remove todo from Supabase
  const deleteTodo = async (id: number) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting task:', error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full p-2 border rounded shadow focus:outline-none focus:ring focus:ring-indigo-200"
        />
        <button
          onClick={addTodo}
          className="w-full mt-3 p-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-500 transition duration-300"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center p-2 bg-gray-100 rounded shadow">
            <span
              onClick={() => toggleComplete(todo.id, todo.is_complete)}
              className={`cursor-pointer ${
                todo.is_complete ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.task}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:text-red-800 transition duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
