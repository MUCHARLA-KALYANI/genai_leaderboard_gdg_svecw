import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'; // Import the papaparse library
import './leaderboard.css'; 
import { BarLoader } from 'react-spinners';

function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const [sortColumn, setSortColumn] = useState('User Name'); // Default sort column
  const [sortDirection, setSortDirection] = useState('asc'); // Default sort direction

  // URL to the published CSV
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRWF3kSOVn972jyMvsVo-vCNS4OJDbZ01g_NbxG-sNE33k4QxD3cLL8LTFU422qnzeAhJOYfV0Mb5SU/pub?output=csv';

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

  // Sort the filtered data based on the selected column and direction
  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // Handle numerical sorting
    const aNum = parseInt(aValue) || 0;
    const bNum = parseInt(bValue) || 0;

    if (sortDirection === 'asc') {
      return aNum - bNum || aValue.localeCompare(bValue);
    } else {
      return bNum - aNum || bValue.localeCompare(aValue);
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sort direction if the same column is clicked
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new column to sort and reset to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Function to render the sort arrow based on the current sort state
  const renderSortArrow = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ▲' : ' ▼'; // Arrow indicators for ascending and descending
    }
    return ''; // No arrow if not sorting by this column
  };

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
                <th onClick={() => handleSort('Sr No.')}>Rank{renderSortArrow('Sr No.')}</th>
                <th onClick={() => handleSort('User Name')}>Name{renderSortArrow('User Name')}</th>
                <th className="email-column" onClick={() => handleSort('User Email')}>User Email{renderSortArrow('User Email')}</th>
                <th onClick={() => handleSort('Access Code Redemption Status')}>Access Code Redemption{renderSortArrow('Access Code Redemption Status')}</th>
                <th onClick={() => handleSort('All Skill Badges & Games Completed')}>All Skill Badges & Games Completed{renderSortArrow('All Skill Badges & Games Completed')}</th>
                <th onClick={() => handleSort('# of Skill Badges Completed')}>No of Skill Badges Completed{renderSortArrow('# of Skill Badges Completed')}</th>
                <th onClick={() => handleSort('# of Arcade Games Completed')}>No of Arcade Games Completed{renderSortArrow('# of Arcade Games Completed')}</th>
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
