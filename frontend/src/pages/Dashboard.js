import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [existing, setExisting] = useState(null);
  const [form, setForm] = useState({
    paymentHistory: "",
    creditUtilization: "",
    accountAge: "",
    totalAccounts: "",
    recentInquiries: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API}/api/score/my`, {
      headers: { Authorization: token },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.exists) {
          setExisting(data.record);
          setResult({ score: data.record.score, rating: data.record.rating });
          setForm({
            paymentHistory: data.record.paymentHistory,
            creditUtilization: data.record.creditUtilization,
            accountAge: data.record.accountAge,
            totalAccounts: data.record.totalAccounts,
            recentInquiries: data.record.recentInquiries,
          });
        }
      })
      .catch(() => {});
  }, [token]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError("");

    const payload = {
      paymentHistory: Number(form.paymentHistory),
      creditUtilization: Number(form.creditUtilization),
      accountAge: Number(form.accountAge),
      totalAccounts: Number(form.totalAccounts),
      recentInquiries: Number(form.recentInquiries),
    };

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/score/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setResult({ score: data.score, rating: data.rating });
      setLoading(false);
    } catch (err) {
      setError("Could not connect to server");
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>My Credit Score</h2>

      {result && (
        <div className="card score-display">
          <div className="score-number">{result.score}</div>
          <div className={`score-rating rating-${result.rating.replace(" ", "")}`}>
            {result.rating}
          </div>
          <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: "13px" }}>
            Score range: 300 (Very Poor) — 850 (Excellent)
          </p>
        </div>
      )}

      <div className="card score-form">
        <h3 style={{ marginBottom: "16px" }}>
          {existing ? "Update Your Credit Data" : "Enter Your Credit Data"}
        </h3>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-group">
          <label>Payment History (0–100%) — % of bills paid on time</label>
          <input
            type="number"
            name="paymentHistory"
            value={form.paymentHistory}
            onChange={handleChange}
            placeholder="e.g. 85"
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Credit Utilization (0–100%) — % of credit limit used</label>
          <input
            type="number"
            name="creditUtilization"
            value={form.creditUtilization}
            onChange={handleChange}
            placeholder="e.g. 30"
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Account Age (0–10 years) — average age of your accounts</label>
          <input
            type="number"
            name="accountAge"
            value={form.accountAge}
            onChange={handleChange}
            placeholder="e.g. 5"
            min="0"
            max="10"
          />
        </div>

        <div className="form-group">
          <label>Total Accounts (0–20) — number of credit accounts</label>
          <input
            type="number"
            name="totalAccounts"
            value={form.totalAccounts}
            onChange={handleChange}
            placeholder="e.g. 4"
            min="0"
            max="20"
          />
        </div>

        <div className="form-group">
          <label>Recent Inquiries (0–10) — number of recent credit checks</label>
          <input
            type="number"
            name="recentInquiries"
            value={form.recentInquiries}
            onChange={handleChange}
            placeholder="e.g. 2"
            min="0"
            max="10"
          />
        </div>

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Calculating..." : existing ? "Update Score" : "Calculate Score"}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
