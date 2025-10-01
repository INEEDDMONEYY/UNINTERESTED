import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css'

import App from './App.jsx'
import Home from './pages/homePage.jsx'
import SignIn from './pages/signInPage.jsx'
import SignUp from './pages/signUpPage.jsx'
import ForgotPass from './pages/forgotPassPage.jsx'
import Post from './pages/postPage'
import ProtectedRoute from './components/ProtectedRoute.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "signin",
    element: <SignIn/>,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "forgotpass",
    element: <ForgotPass />,
  },
  {
    path: "post",
    element: <Post />,
  },
  
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
