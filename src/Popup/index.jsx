import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';


function Popup({show, handleClose, query}) {
  
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
          {query && query.map((item, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Label className="fw-semibold">{item.entity}</Form.Label>
                {item.type === 'select' ? (
                  <Form.Control as="select" className='custom-select-scroll'>
                    {item.options && item.options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </Form.Control>
                ) : (
                  <Form.Control type="text" value={item.value || ''}  />
                )}
              </Form.Group>
            ))}
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