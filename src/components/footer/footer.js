import React from 'react'
import { Link } from 'react-router-dom';
import "../navbar/nav.css";

const footer = () => {
  return (
    <>
      <p className='footer'>
        This website is developed by &nbsp; <Link to="https://www.linkedin.com/company/gdg-svecw/">GDG-SVECW</Link>
      </p>
    </>
  )
}

export default footer