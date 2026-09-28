import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDetailPage from './pages/UserDetailPage';
import HomePage from './pages/HomePage';
import ChatBotPage from './pages/ChatBotPage';
import ApplicationPage from './pages/ApplicationPage';

function App() {

  return (
    <>
      
       <BrowserRouter>

        <Routes>
          <Route 
          path="/" index 
          element={<LandingPage/>}>
          </Route>

          <Route
          path="/login"
          element={<LoginPage/>}>
          </Route>

          <Route
          path="/register"
          element={<RegisterPage/>}>
          </Route>

          <Route
          path="/user"
          element={<UserDetailPage/>}>
          </Route>

          <Route
          path="/home"
          element={<HomePage/>}>
          </Route>

          <Route
          path="/chatbot"
          element={<ChatBotPage/>}
          >
          </Route>

          <Route
          path="/application"
          element={<ApplicationPage/>}
          >
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
