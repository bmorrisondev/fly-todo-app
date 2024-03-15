"use client"
import { FormEvent, useEffect, useState } from "react";
import { isCompositeComponent } from "react-dom/test-utils";

type Task = {
  id: number;
  name: string;
  isComplete: boolean;
};

export default function Home() {
  const [taskName, setTaskName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, [])

  function saveTasks(t: Task[]) {
    localStorage.setItem("tasks", JSON.stringify(t));
    setTasks(t);
  }

  async function addTask() {
    if (!taskName) return;

    const id = Date.now();
    saveTasks([...tasks, { id, name: taskName, isComplete: false }])
    setTaskName("");
  }

  async function completeTask(id: number) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          isComplete: !task.isComplete
        }
      }
      return task;
    });

    saveTasks(updatedTasks)
  }

  async function deleteTask(id: number) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-lg bold mb-4">Next Todos</h1>
      <div className="flex justify-center mb-4 gap-2 w-full">
        <form onSubmit={addTask}></form>
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="input input-bordered w-full max-w-xs" />
        <button className="btn btn-primary" onClick={addTask}>Submit</button>
      </div>
      <div className="flex flex-col w-full gap-2 ">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center p-4 border border-gray-200 rounded-lg shadow-lg gap-2 bg-white">
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={() => completeTask(task.id)} />
            <span className={`flex-1 ${task.isComplete && 'line-through'}`}>{task.name}</span>
            <button className="btn btn-ghost" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
}
