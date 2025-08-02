import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Card, Container, Alert, FormSelect, Table, Badge } from 'react-bootstrap';


const API_URL = 'http://localhost:8000/api/todos';
const USERS_API_URL = 'http://localhost:8000/api/users';

const TodoAssign = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'start',
    assigned_to_id: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [todoType, setTodoType] = useState('create'); // 'create' or 'assign'
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAssignedTasks();
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USERS_API_URL, getAuthConfig());
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    }
  };

  const fetchAssignedTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await axios.get(`${API_URL}/assigned-by-me`, getAuthConfig());
      setAssignedTasks(response.data);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      setError('Failed to fetch assigned tasks.');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'start': { variant: 'secondary', text: 'Start' },
      'inprogress': { variant: 'warning', text: 'In Progress' },
      'completed': { variant: 'success', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (todoType === 'assign' && !formData.assigned_to_id) {
      setError('Please select a user to assign the todo to');
      setLoading(false);
      return;
    }

    try {
      // Use the same API endpoint for both create and assign
      const requestData = {
        title: formData.title,
        description: formData.description,
        status: formData.status
      };

      // Add assignedTo field only when assigning to someone else
      if (todoType === 'assign') {
        requestData.assigned_to_id = formData.assigned_to_id;
      }

      await axios.post(API_URL, requestData, getAuthConfig());
      setSuccess(todoType === 'create' ? 'Todo created successfully!' : 'Todo assigned successfully!');

      setFormData({
        title: '',
        description: '',
        status: 'start',
        assigned_to_id: ''
      });

      // Refresh the assigned tasks list
      if (todoType === 'assign') {
        fetchAssignedTasks();
      }
    } catch (error) {
      console.error('Error saving todo:', error);
      setError(todoType === 'create' ? 'Failed to create todo. Please try again.' : 'Failed to assign todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card>
            <Card.Header>
              <h3 className="mb-0">Create/Assign Todo</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <div className="mb-4">
                <div className="btn-group w-100" role="group">
                  <Button
                    variant={todoType === 'create' ? 'primary' : 'outline-primary'}
                    onClick={() => setTodoType('create')}
                  >
                    Create for Me
                  </Button>
                  <Button
                    variant={todoType === 'assign' ? 'primary' : 'outline-primary'}
                    onClick={() => setTodoType('assign')}
                  >
                    Assign to Others
                  </Button>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter todo title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter todo description (optional)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <FormSelect
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="start">Start</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </FormSelect>
                </Form.Group>

                {todoType === 'assign' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Assign To *</Form.Label>
                    <FormSelect
                      name="assigned_to_id"
                      value={formData.assigned_to_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </FormSelect>
                  </Form.Group>
                )}

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading 
                      ? (todoType === 'create' ? 'Creating...' : 'Assigning...') 
                      : (todoType === 'create' ? 'Create Todo' : 'Assign Todo')
                    }
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Assigned Tasks Section */}
          <Card className="mt-4">
            <Card.Header>
              <h4 className="mb-0">Tasks I've Assigned to Others</h4>
            </Card.Header>
            <Card.Body>
              {loadingTasks ? (
                <div className="text-center">
                  <p>Loading assigned tasks...</p>
                </div>
              ) : assignedTasks.length === 0 ? (
                <div className="text-center">
                  <p className="text-muted">No tasks assigned to others yet.</p>
                </div>
              ) : (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.description || '-'}</td>
                        <td>{task.assigned_to?.name || 'Unknown'}</td>
                        <td>{getStatusBadge(task.status)}</td>
                        <td>{new Date(task.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default TodoAssign; 