import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, Form, Modal, FormSelect, Badge } from 'react-bootstrap';

const API_URL = 'http://localhost:8000/api/todos';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  // Helper function to get auth headers
  const getAuthConfig = () => {
    const token = localStorage.getItem('auth_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL, getAuthConfig());
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/${editId}`, { title, description }, getAuthConfig());
      setTitle('');
      setDescription('');
      setEditId(null);
      setShowModal(false);
      fetchTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditId(todo.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { status: newStatus }, getAuthConfig());
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'start': 'secondary',
      'inprogress': 'warning',
      'completed': 'success'
    };
    return (
      <Badge 
        bg={statusColors[status] || 'secondary'}
        className="me-2"
        style={{ 
          fontSize: '0.875rem',
          padding: '0.375rem 0.75rem',
          lineHeight: '1.5'
        }}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Todos</h1>

      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading todos...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-2"
            onClick={fetchTodos}
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <ListGroup className="mt-4">
          {todos.map((todo) => (
            <ListGroup.Item
              key={todo.id}
              className="d-flex justify-content-between align-items-center"
            >
                                       <div className="flex-grow-1">
               <div className="d-flex justify-content-between align-items-start mb-2">
                 <h6 className="mb-1">{todo.title}</h6>
               </div>
               
               {todo.description && (
                 <p className="text-muted mb-2">{todo.description}</p>
               )}
             </div>
               <div className='d-flex'>
                 {getStatusBadge(todo.status)}
                <FormSelect
                  size="sm"
                  value={todo.status || 'start'}
                  onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                  className="me-2"
                  style={{ width: 'auto' }}
                >
                  <option value="start">Start</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </FormSelect>
                
                {todo.status !== 'completed' && (
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleEdit(todo)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {todos.length === 0 && !loading && !error && (
        <div className="text-center text-muted mt-5">
          <h5>No todos found</h5>
          <p>Create your first todo to get started.</p>
        </div>
      )}

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditId(null);
          setTitle('');
          setDescription('');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TodoList;
