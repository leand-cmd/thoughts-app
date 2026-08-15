import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  const linkStyle = (path) => ({
    padding: '10px 20px',
    color: location.pathname === path ? '#fff' : '#9ca3af',
    backgroundColor: location.pathname === path ? '#3b82f6' : 'transparent',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    fontSize: '14px'
  });

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      padding: '12px 24px',
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      borderRadius: '8px'
    }}>
      <Link to="/" style={linkStyle('/')}>🧠 Pensamientos</Link>
      <Link to="/gym" style={linkStyle('/gym')}>💪 Gym</Link>
    </nav>
  );
};

export default NavBar;
