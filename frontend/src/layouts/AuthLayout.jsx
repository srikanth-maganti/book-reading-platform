// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="auth-wrapper">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
