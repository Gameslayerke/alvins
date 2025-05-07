import React from 'react';
import '../styles/Loader.css'; // Adjust the path as necessary

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner"></div>
        <p className="loader-text">{message}</p>
        <p className="loader-subtext">Please wait while we fetch your content</p>
      </div>
    </div>
  );
};

export default Loader;