import React, { useState, useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Leaderboard from './components/leaderboard/leaderboard';
import NavBar from './components/navbar/nav';
import Footer from './components/footer/footer';


function App() {
  const [warning, setWarning] = useState('');

  useEffect(() => {
    
    const handleContextMenu = (event) => {
      event.preventDefault();
      setWarning('Data is protected');
      setTimeout(() => setWarning(''), 2000); 
    };

    const handleKeydown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        setWarning('Inspecting is disabled! Data is protected');
        setTimeout(() => setWarning(''), 2000); 
      }
      
    };

   
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeydown);

    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <>
     
      <div className={warning ? "blur-content" : ""}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Leaderboard />} />
           
          
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>

     
      {warning && <div className="warning">{warning}</div>}
    </>
  );
}

export default App;