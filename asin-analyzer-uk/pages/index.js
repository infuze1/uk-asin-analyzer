import React, { useState } from "react";

export default function ASINAnalyzer() {
  const [asin, setAsin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeASIN = async () => {
    if (!asin) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze-asin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 7) return "Great";
    if (score >= 4) return "Average";
    return "Poor";
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "1rem" }}>
        UK Amazon ASIN Analyzer
      </h1>

      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <input
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          placeholder="Enter ASIN or Amazon URL"
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
        />
        <button
          onClick={analyzeASIN}
          disabled={loading}
          style={{ width: "100%", padding: "0.75rem", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          {loading ? "Analyzing..." : "Analyze Listing"}
        </button>
      </div>

      {result && (
        <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "0.5rem 1rem", borderRadius: "9999px", fontWeight: "600" }}>
              Brand Owner: {result.brand}
            </span>
          </div>
          <h2 style={{ textAlign: "center", fontWeight: "600", marginBottom: "1rem" }}>{result.title}</h2>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              display: "inline-flex",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: result.score >= 7 ? '#4ade80' : result.score >= 4 ? '#facc15' : '#f87171',
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "white"
            }}>
              {result.score}
            </div>
            <div style={{ marginTop: "0.5rem", fontWeight: "600" }}>{getScoreLabel(result.score)}</div>
          </div>
          <p><strong>ASIN:</strong> {result.asin}</p>
          <p><strong>Current Sellers:</strong> {result.latestSellerCount}</p>
          <p><strong>Average Sellers:</strong> {result.avgSellerCount}</p>
          <p><strong>Verdict:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
}

