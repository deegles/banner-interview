import classNames from "classnames"
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg"
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg"
import CircularProgressBar from "../CircularProgressBar"
import "./style.scss"
import { Task } from "../../providers/data"
import { useData } from "../../providers/hook/useData"


const TaskCard = ({ task }: {task: Task}) => {
  const { id, title, priority, status, progress } = task

  const data = useData();

  const { setSelectedTask, setShowAddEditModal, setShowDeleteModal, updateTask} = data;

  return (
    <div className="task-card">
      <div className="flex w-100">
        <span className="task-title">Task {id}</span>
        <span className="task">{title}</span>
      </div>
      <div className="flex">
        <span className="priority-title">Priority</span>
        <span className={classNames(`${priority}-priority`, "priority")}>{priority}</span>
      </div>
      <div className="progress">
        <CircularProgressBar strokeWidth={2} sqSize={24} percentage={progress} />
      </div>
      <div className="task-status-wrapper">
        <button className="status" onClick={() => {
          let newStatus = task.status;
          let newProgress = task.progress;
          if(status === "To Do") {
            newStatus = "In Progress";
            newProgress = 50;
          } else if(status === "In Progress") {
            newStatus = "Done";
            newProgress = 100;
          } else if(status === "Done") {
            newStatus = "To Do";
            newProgress = 0;
          } else {
            newStatus = "To Do";
            newProgress = 0;
          }

          updateTask({
            ...task,
            status: newStatus,
            progress: newProgress
          })
        }}>{status}</button>
      </div>
      <div className="actions">
        <EditIcon className="mr-20 cp" onClick={() => {
          setSelectedTask(task);
          setShowAddEditModal(true);
        }} />
        <DeleteIcon className="cp" onClick={() => {
          setSelectedTask(task);
          setShowDeleteModal(true);
        }} />
      </div>
    
    </div>
  )
}

export default TaskCard
