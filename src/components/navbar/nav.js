import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from "../../assets/GDG.webp";
import "./nav.css";
import { MoonLoader, PulseLoader } from 'react-spinners';
import Papa from 'papaparse';

const Nav = () => {
  const [data, setData] = useState({
    time: "",
    arcade: 0,
    enrolled: 0,
    completed: 0,
    allComplete: 0, // Ensure allComplete is included in state
  });

  const [loading, setLoading] = useState(true);  

  // URL to the published CSV
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnXptz-ItgkK8p6uXeuRO3v9xIeBiXQ4ftYfqhVOEptT0I6bBixaEnVPQp5YLcDc80Gl3cpDPPLzer/pub?gid=734950026&single=true&output=csv';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);  
      try {
        // Fetching CSV data
        const response = await axios.get(csvUrl);
        const csvData = response.data;

        // Parsing CSV data
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            const parsedData = results.data;
            const enrolled = parsedData.length; // Total participants enrolled
            const arcade = parsedData.filter(row => row['# of Arcade Games Completed'] === '1').length; 
            const completed = parsedData.filter(row => row['# of Skill Badges Completed'] === '15').length; // Count of participants who completed skill badges
            const allComplete = parsedData.filter(row => 
              row['# of Arcade Games Completed'] === '1' && 
              row['# of Skill Badges Completed'] === '15'
            ).length; // Count of participants who completed both
            
            const currentTime = new Date().toLocaleString(); // Get current time
            
            // Update state with all values, including allComplete
            setData({ time: currentTime, arcade, enrolled, completed, allComplete });
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);  
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="nav_container">
        <div className="logo">
          <img src={Logo} alt="Google Developer Groups" />
          {/* change the logo file above in imports with your campus logo */}
        </div>

        <div className="time">
          Last Updated: {data.time || <PulseLoader size={5} />}
        </div>
      </div>

      <div className="live">
        GenAI Study Jams & GenAI Arcade is Live!!
      </div>

      <div className="analytics">
        <div className="data_card">
          <div>No of participants enrolled</div>
          <p>{loading ? <MoonLoader size={10} /> : data.enrolled}</p>
        </div>

        <div className="data_card">
          <div>No of participants completed Arcade</div>
          <p>{loading ? <MoonLoader size={10} /> : data.arcade}</p>
        </div>

        <div className="data_card">
          <div>No of participants completed 15 Skill Badges</div>
          <p>{loading ? <MoonLoader size={10} /> : data.completed}</p>
        </div>

        <div className="data_card">
          <div>No of participants completed Arcade and 15 Skill Badges</div>
          <p>{loading ? <MoonLoader size={10} /> : data.allComplete}</p> {/* Use data.allComplete */}
        </div>
      </div>
    </>
  );
};

export default Nav;
