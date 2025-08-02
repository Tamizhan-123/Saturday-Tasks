import React from 'react';
import TodoList from './components/TodoList';
import TodoAssignedMe from './components/TodoAssignedMe';
import TodoAssign from './components/TodoAssign';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navigation from './components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from 'react-router-dom';

import {Routes, Route} from "react-router-dom";



function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        } />
        <Route path="/assigned-todos" element={
          <ProtectedRoute>
            <TodoAssignedMe />
          </ProtectedRoute>
        } />
        <Route path="/assign-todo" element={
          <ProtectedRoute>
            <TodoAssign />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;