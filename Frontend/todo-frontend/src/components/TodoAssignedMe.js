import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, FormSelect, Badge } from 'react-bootstrap';

const API_URL = 'http://localhost:8000/api/todos/assigned';

const TodoAssignedMe = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('start');

  useEffect(() => {
    fetchAssignedTodos();
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

  const fetchAssignedTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL, getAuthConfig());
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching assigned todos:', error);
      setError('Failed to fetch assigned todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log(id);
      await axios.patch(`http://localhost:8000/api/todos/${id}`, { status: newStatus }, getAuthConfig());
      fetchAssignedTodos();
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
      <h1 className="mb-4">Todos Assigned to Me</h1>

      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading assigned todos...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-2"
            onClick={fetchAssignedTodos}
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
            className="d-flex justify-content-between align-items-start"
          >
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-1">{todo.title}</h6>
                {getStatusBadge(todo.status)}
              </div>
              
              {todo.description && (
                <p className="text-muted mb-2">{todo.description}</p>
              )}
              
              <div className="mb-2">
                <small className="text-muted">
                  <strong>Assigned by:</strong> {todo.assigned_by || 'Unknown'}
                </small>
              </div>


            </div>

            <div className="d-flex flex-column gap-2 ms-3">
              <FormSelect
                size="sm"
                value={todo.status || 'start'}
                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="start">Start</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </FormSelect>
              

            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      )}

      {todos.length === 0 && !loading && !error && (
        <div className="text-center text-muted mt-5">
          <h5>No todos assigned to you yet</h5>
          <p>When someone assigns you a todo, it will appear here.</p>
        </div>
      )}


    </div>
  );
};

export default TodoAssignedMe; 