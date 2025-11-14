import { useData } from "../../providers/hook/useData";
import Button from "../Button"
import Modal from "../Modal"
import "./style.scss"

const DeleteModal = () => {
    const data = useData();
  
    const {selectedTask, deleteTask, setShowDeleteModal} = data;
    
  return (
    <Modal>
      <div className="delete-modal">
        <p>Are you sure you want to delete this task?</p>
        <div className="delete-modal__actions">
          <Button title="Delete" onClick={() => {
            if(selectedTask) {
              deleteTask(selectedTask.id);
            }
            setShowDeleteModal(false);
          }} />
          <Button title="Cancel" outline onClick={() => {
            setShowDeleteModal(false);
          }} />
        </div>
      </div>
    </Modal>
  )
}

export default DeleteModal
