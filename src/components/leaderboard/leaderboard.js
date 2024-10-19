import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // Import the papaparse library
import './leaderboard.css'; 
import { BarLoader } from 'react-spinners';

function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  // URL to the published CSV
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnXptz-ItgkK8p6uXeuRO3v9xIeBiXQ4ftYfqhVOEptT0I6bBixaEnVPQp5YLcDc80Gl3cpDPPLzer/pub?gid=734950026&single=true&output=csv';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvUrl);
        const csvData = await response.text();

        // Parse the CSV data
        Papa.parse(csvData, {
          header: true, // Treat the first row as headers
          complete: (result) => {
            setData(result.data); // Set the parsed data to state
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(row =>
    row['User Name']?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the filtered data based on skill badges completed or any other metric
  const sortedData = filteredData.sort((a, b) => {
    return (
      parseInt(b['# of Skill Badges Completed']) - parseInt(a['# of Skill Badges Completed'])
    );
  });

  return (
    <>
      <div className="leaderboard-title">GenAI & Arcade Leaderboard</div>
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search Your Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="leaderboard-container">
        {loading ? (
          <p className="Loadingdata">
            <BarLoader width="100%" color="#0a0a6d" />
          </p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th className="email-column">User Email</th>
                <th>Access Code Redemption</th>
                <th>All Skill Badges & Games Completed</th>
                <th>No of Skill Badges Completed</th>
                <th>No of Arcade Games Completed</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* Rank is determined by the index in the sorted array */}
                  <td>{row['User Name']}</td>
                  <td className="email-column">{row['User Email']}</td>
                  <td className="centered-cell">
                    <p className={`${row['Access Code Redemption Status'] === 'Yes' ? 'yes-cell' : 'no-cell'}`}>
                      {row['Access Code Redemption Status']}
                    </p>
                  </td>
                  <td className="centered-cell">
                    <p className={`${row['All Skill Badges & Games Completed'] === 'Yes' ? 'yes-cell' : 'no-cell'}`}>
                      {row['All Skill Badges & Games Completed']}
                    </p>
                  </td>
                  <td className="centered-cell">{row['# of Skill Badges Completed']}</td>
                  <td className="centered-cell">
                    <p className={`${row['# of Arcade Games Completed'] === '1' ? 'yes-cell' : 'no-cell'}`}>
                      {row['# of Arcade Games Completed']}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Leaderboard;
