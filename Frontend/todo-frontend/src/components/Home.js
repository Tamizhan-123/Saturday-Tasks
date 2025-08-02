import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Container className="mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to Your Todo App</h1>
        <p className="lead text-muted">Organize your tasks and boost your productivity</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body className="p-5">
              <div className="mb-4">
                <h2 className="mb-3">🚀 Ready to get started?</h2>
                <p className="text-muted">
                  Manage your tasks, track your progress, and stay organized with our simple and intuitive todo app.
                </p>
              </div>
              
              <Button 
                as={Link} 
                to="/todos" 
                variant="primary" 
                size="lg"
                className="px-4 py-2"
              >
                Go to My Todos
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 