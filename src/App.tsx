import { useState } from "react"
import "./App.scss"
import { ReactComponent as Add } from "./assets/icons/add.svg"
import AddEditTaskForm from "./components/AddEditTaskForm"
import Button from "./components/Button"
import DeleteModal from "./components/DeleteModal"
import TaskCard from "./components/TaskCard"
import { useData } from "./providers/hook/useData"

const App = () => {
  const data = useData();

  const { taskList, setSelectedTask, setShowAddEditModal, showAddEditModal, showDeleteModal } = data;

  return (
    <div className="container">
      <div className="page-wrapper">
        <div className="top-title">
          <h2>Task List</h2>
          <Button title="Add Task" icon={<Add />} onClick={() => {
            setSelectedTask(null);
            setShowAddEditModal(true);
          }} />
        </div>
        <div className="task-container">
          {taskList.map((task, i) => (
            <TaskCard key={i} task={task}  />
          ))}
        </div>
      </div>
      {showAddEditModal && <AddEditTaskForm />}
      {showDeleteModal && <DeleteModal />}
    </div>
  )
}

export default App
