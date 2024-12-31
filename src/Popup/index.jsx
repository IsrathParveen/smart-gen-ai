import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Popup({ show, handleClose, query, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (entity, value) => {
    console.log(entity, value,"line no10 in popup");
    const formattedString = `${entity}:${value}`;
    setFormData(formattedString);
    // const formattedString = `${entity}+${value}`;
    // console.log(formattedString);
    // setFormData(
    //   // const updatedFormData = prevState.filter(item => !item.startsWith(`${entity}:`));
    //   formattedString
    // );
  };

  const handleSubmit = () => {
    console.log(formData);
    onSubmit(formData);
    handleClose();
  };

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
                {true ? (
                  <Form.Control
                  as="select"
                  className='custom-select-scroll'
                  onChange={(e) => {console.log(e,"line 41 in popup");handleChange(item.entity, e.target.value)}}
                >
                  {item.options && item.options.map((option, idx) => (
                    <option key={idx} value={item.value} >{option}</option>
                  ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type="text"
                  value={formData[item.entity] || ''}
                  onChange={(e) => handleChange(item.entity, e.target.value)}
                />
                )}
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button type="button" variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Popup;