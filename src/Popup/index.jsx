import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';


function Popup({ show, handleClose, query, onSubmit }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Initialize formData with query values
    const initialFormData = {};
    query.forEach(item => {
      initialFormData[item.entity] = item.value || '';
    });
    setFormData(initialFormData);
  }, [query]);

  const handleChange = (entity, selectedOption) => {
    setFormData(prevState => ({
      ...prevState,
      [entity]: selectedOption.value
    }));
  };
  const handleTextChange = (entity, value) => {
    setFormData(prevState => ({
      ...prevState,
      [entity]: value
    }));
  };


  const handleSubmit = () => {
    // Format formData into a single string
    const formattedString = Object.entries(formData)
      .map(([key, value]) => `${key}:${value}`)
      .join(', ');
    onSubmit( formattedString );
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
                {item.type === 'select' ? (
                  // <Form.Control
                  //   as="select"
                  //   className='custom-select-scroll'
                  //   value={formData[item.entity] || ''}
                  //   onChange={(e) => handleChange(item.entity, e.target.value)}
                  // >
                  //   {item.options && item.options.map((option, idx) => (
                  //     <option key={idx} value={option}>{option}</option>
                  //   ))}
                  // </Form.Control>
                  <Select
                  className='custom-select-scroll'
                  value={{ value: formData[item.entity], label: formData[item.entity] }}
                  onChange={(selectedOption) => handleChange(item.entity, selectedOption)}
                  options={item.options.map(option => ({ value: option, label: option }))}
                />

                ) : (
                  <Form.Control
                    type="text"
                    value={formData[item.entity] || ''}
                    onChange={(e) => handleTextChange(item.entity, e.target.value)}
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