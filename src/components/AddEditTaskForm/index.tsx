import classNames from "classnames"
import { ReactComponent as Close } from "../../assets/icons/close.svg"
import Button from "../Button"
import Input from "../Input"
import Modal from "../Modal"
import "./style.scss"
import { useData } from "../../providers/hook/useData"
import React from "react"
import { Task } from "../../providers/data"

const AddEditTaskForm = () => {
  const data = useData();

  const {selectedTask, updateTask, setShowAddEditModal, setSelectedTask} = data;

  const [title, setTitle] = React.useState(selectedTask ? selectedTask.title : "");
  const [selectedPriority, setSelectedPriority] = React.useState(selectedTask ? selectedTask.priority : "medium");

  return (
    <Modal>
      <form>
        <div className="add-edit-modal">
          <div className="flx-between">
            <span className="modal-title">{selectedTask ? "Edit Task" : "Add Task" }</span>
            <Close className="cp" onClick={() => {
              setSelectedTask(null);
              setShowAddEditModal(false);
            }}/>
          </div>
          <Input label="Task" placeholder="Type your task here..." onChange={(e) => {
            e.preventDefault();
            setTitle(e.target.value);
          }} name="title" value={title} />
          <div className="modal-priority">
            <span>Priority</span>
            <ul className="priority-buttons">
              {['high', 'medium', 'low'].map((priority) => (
                <li
                  key={priority}
                  className={classNames(priority, { [`${priority}-selected`]: selectedPriority === priority })}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPriority(priority);
                  }}
                >
                  {priority}
                </li>
              ))}
            </ul>
          </div>
          <div className="flx-right mt-50">
            <Button title={selectedTask ? "Edit" : "Add"} onClick={() => {
              let newTask: Partial<Task> = {}

              if(selectedTask) { 
                newTask = { ...selectedTask }
              }

              newTask.title = title;
              newTask.priority = selectedPriority;
              newTask.status = selectedTask ? selectedTask.status : "to do";
              newTask.progress = selectedTask ? selectedTask.progress : 0;

              updateTask({
                  ...newTask
                });

                setShowAddEditModal(false);
            }} />
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default AddEditTaskForm
