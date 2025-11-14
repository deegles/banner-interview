import { createContext, useCallback, useEffect, useState } from "react";

export interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  progress: number;
}

export interface DataContextType {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  taskList: Task[];
  updateTask: (task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  showAddEditModal: boolean;
  showDeleteModal: boolean;
  setShowAddEditModal: (value: boolean) => void;
  setShowDeleteModal: (value: boolean) => void;
}

export const DataContext = createContext<DataContextType>({
  taskList: [],
  selectedTask: null,
  updateTask: (task: Partial<Task>) => {},
  setSelectedTask: (task: Task | null) => {},
  showAddEditModal: false,
  showDeleteModal: false,
  setShowAddEditModal: (value: boolean) => {},
  setShowDeleteModal: (value: boolean) => {},
  deleteTask: (id: number) => {},
});

export interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Task[]>([]);
  const [selectedTask, setTask] = useState<Task | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const tasks = await response.json();
      console.log("Fetched tasks:", tasks);
      setData(tasks.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = useCallback((task: Partial<Task>) => {
    // Update task logic here
    // writeFileSync
    fetch("/api/task/" + (task.id ? task.id : ""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Optionally refresh the task list or update state
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const setSelectedTaskCallback = useCallback((task: Task | null) => {
    setTask(task);
  }, []);

  const deleteTask = useCallback((id: number) => {
    fetch("/api/task/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Deleted:", data);
        // Optionally refresh the task list or update state
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const contextValue = {
    taskList: data,
    updateTask,
    setSelectedTask: setSelectedTaskCallback,
    selectedTask: selectedTask,
    showAddEditModal,
    showDeleteModal,
    setShowAddEditModal,
    setShowDeleteModal,
    deleteTask,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
