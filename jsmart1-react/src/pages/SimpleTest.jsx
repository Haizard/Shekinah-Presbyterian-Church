import React from 'react';
import { Link } from 'react-router-dom';

const SimpleTest = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Simple Test Page</h1>
      <p>This is a very simple test page with no external dependencies.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ 
          display: 'inline-block', 
          padding: '10px 20px', 
          backgroundColor: 'blue', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px' 
        }}>
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default SimpleTest;
