import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

function Navigation() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('auth_token');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Navbar bg="light" expand="lg" className="px-4">
      <Navbar.Brand as={Link} to="/" className="fw-bold">
        📝 Todo App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/todos">My Todos</Nav.Link>
          <Nav.Link as={Link} to="/assigned-todos">Assigned to Me</Nav.Link>
          <Nav.Link as={Link} to="/assign-todo">Create/Assign Todo</Nav.Link>
        </Nav>
        <Nav>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation; 