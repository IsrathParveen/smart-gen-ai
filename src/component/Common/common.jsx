import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Common({show,handleClose,onNewQuestionClick}) {
//   const [show, setShow] = useState(true);

//   const handleClose = () => setShow(false);
  

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        It looks like you're in the middle of something.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onNewQuestionClick}  >
            I want to ask a new question
          </Button>
          <Button variant="primary" onClick={handleClose}>Never mind,I'll continue</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Common;