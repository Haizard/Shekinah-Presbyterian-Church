import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TestPage = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '60px 0', minHeight: '70vh' }}>
        <div className="container">
          <h1>Test Page</h1>
          <p>This is a test page to verify that routing is working correctly.</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TestPage;
