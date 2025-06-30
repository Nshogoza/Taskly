"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit2, Check, Plus } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

type FilterType = "all" | "active" | "completed"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskflow-tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error("Error loading tasks:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [task, ...prev])
    setNewTask("")
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (!editText.trim() || !editingId) return

    setTasks((prev) => prev.map((task) => (task.id === editingId ? { ...task, text: editText.trim() } : task)))
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed)
      case "completed":
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }

  const activeTasks = tasks.filter((task) => !task.completed).length
  const completedTasks = tasks.filter((task) => task.completed).length
  const filteredTasks = getFilteredTasks()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            <div className="text-sm text-gray-500">
              {tasks.length === 0
                ? "No tasks"
                : activeTasks === tasks.length
                  ? `${tasks.length} task${tasks.length === 1 ? "" : "s"}`
                  : `${activeTasks} of ${tasks.length} active`}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Task Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={addTask} className="px-6">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="capitalize"
            >
              {filterType}
            </Button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Check className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === "completed"
                    ? "No completed tasks"
                    : filter === "active"
                      ? "No active tasks"
                      : "No tasks yet"}
                </h3>
                <p className="text-gray-500">
                  {filter === "all"
                    ? "Add your first task to get started!"
                    : `Switch to "${filter === "active" ? "all" : "all"}" to see all tasks`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Toggle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 p-0 ${
                        task.completed
                          ? "bg-green-500 border-green-500 hover:bg-green-600"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 text-white" />}
                    </Button>

                    {/* Task Text / Edit Input */}
                    <div className="flex-1 min-w-0">
                      {editingId === task.id ? (
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveEdit()
                            } else if (e.key === "Escape") {
                              cancelEdit()
                            }
                          }}
                          onBlur={saveEdit}
                          autoFocus
                          className="w-full"
                        />
                      ) : (
                        <span
                          className={`block cursor-pointer ${
                            task.completed ? "line-through text-gray-500" : "text-gray-900"
                          }`}
                          onDoubleClick={() => startEdit(task.id, task.text)}
                        >
                          {task.text}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(task.id, task.text)}
                        className="text-gray-400 hover:text-blue-600 p-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Clear Completed Button */}
        {completedTasks > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={clearCompleted}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Completed ({completedTasks})
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
