// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import './index.css';
import { AuthProvider } from './utils/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';

import Profile from './pages/Profile.jsx';
import Books from './pages/Books.jsx';
import Show from './pages/Show.jsx';
import Cart from './pages/Cart.jsx';
import Sell from './pages/Sell.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Welcome from './pages/Welcome.jsx';

const CLIENT_ID = "281202687628-047r4063n08fjgs3okr9gbfj6pjpe0af.apps.googleusercontent.com";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes WITH Navbar and Footer */}
      <Route path='/books' element={<MainLayout />}>
        <Route index element={<Books />} />
        <Route path='show/:id' element={<Show />} />
        <Route path='sell' element={<Sell />} />
      </Route>

      {/* Routes WITHOUT Navbar and Footer */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Welcome />}>
          <Route path="login" element={null} />
          <Route path="signup" element={null} />
        </Route>
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
      </Route>

    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
