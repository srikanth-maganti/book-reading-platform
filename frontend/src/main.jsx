import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import './index.css';
import { AuthProvider } from './utils/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ReaderLayout from './layouts/ReaderLayout.jsx';

import Landing from './pages/Landing.jsx';
import Browse from './pages/Browse.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Reader from './pages/Reader.jsx';
import Library from './pages/Library.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

const CLIENT_ID = "281202687628-047r4063n08fjgs3okr9gbfj6pjpe0af.apps.googleusercontent.com";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Main layout — with Navbar and Footer */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/book/:id" element={<BookDetail />} />
                <Route path="/library" element={<Library />} />

                <Route path="/recommendations" element={<Recommendations />} />
            </Route>

            {/* Reader layout — full screen, no chrome */}
            <Route element={<ReaderLayout />}>
                <Route path="/read/:id" element={<Reader />} />
            </Route>

            {/* Auth layout — no navbar/footer */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
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
