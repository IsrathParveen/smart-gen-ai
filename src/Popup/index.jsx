import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';


function Popup({show,handleClose}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" >
              <Form.Label className="fw-semibold">Region</Form.Label>
              <Form.Control as="select" className='custom-select-scroll'>
                <option>Carolinas</option>
                <option>Florida</option>
                <option>West</option>
                <option>East</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          <Button variant="primary" onClick={handleClose}>
          Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Popup;