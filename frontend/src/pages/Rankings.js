import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL;

function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [filterRating, setFilterRating] = useState("All");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  function fetchRankings() {
    setLoading(true);
    fetch(`${API}/api/score/rankings`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => {
        setRankings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchRankings();
  }, []);

  function handleFilter() {
    if (filterRating === "All") {
      fetchRankings();
      return;
    }

    setLoading(true);
    fetch(`${API}/api/score/filter?rating=${filterRating}`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => {
        setRankings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  return (
    <div className="page">
      <h2>Credit Score Rankings</h2>

      <div className="card">
        <div className="filter-row">
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="All">All Ratings</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Very Poor">Very Poor</option>
          </select>
          <button onClick={handleFilter}>Apply Filter</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : rankings.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No data found.</p>
        ) : (
          <table className="rankings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.userId ? item.userId.name : "Unknown"}</td>
                  <td>{item.score}</td>
                  <td className={`rating-${item.rating.replace(" ", "")}`}>
                    {item.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Rankings;
