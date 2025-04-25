
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">UK Amazon ASIN Analyzer</h1>
      <Card className="mb-6">
        <CardContent className="space-y-4 p-6">
          <Input
            placeholder="Enter ASIN or Amazon URL"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
          />
          <Button onClick={analyzeASIN} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Listing"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                Brand Owner: {result.brand}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-center mt-4">{result.title}</h2>
            <div className="flex flex-col items-center my-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-16 h-16 flex items-center justify-center rounded-full"
                style={{ backgroundColor: result.score >= 7 ? '#4ade80' : result.score >= 4 ? '#facc15' : '#f87171' }}
              >
                <span className="text-white text-xl font-bold">{result.score}</span>
              </motion.div>
              <span className="mt-2 text-sm font-semibold">{getScoreLabel(result.score)}</span>
            </div>
            <p><strong>ASIN:</strong> {result.asin}</p>
            <p><strong>Current Sellers:</strong> {result.latestSellerCount}</p>
            <p><strong>Average Sellers:</strong> {result.avgSellerCount}</p>
            <p><strong>Verdict:</strong> {result.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
