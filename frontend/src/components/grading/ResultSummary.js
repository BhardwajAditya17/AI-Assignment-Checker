import React from "react";
import Card from "../common/Card";

const ResultSummary = ({ sections }) => {
  const totalScore = sections.reduce(
    (acc, sec) => acc + sec.score,
    0
  );

  const totalMax = sections.reduce(
    (acc, sec) => acc + sec.maxScore,
    0
  );

  const percentage =
    totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(2) : 0;

  return (
    <Card className="bg-blue-50">
      <h2 className="text-lg font-bold text-blue-700 mb-3">
        Final Result
      </h2>

      <p className="text-gray-700">
        Total Score:{" "}
        <span className="font-semibold">
          {totalScore} / {totalMax}
        </span>
      </p>

      <p className="text-gray-700 mt-2">
        Percentage:{" "}
        <span className="font-semibold">
          {percentage}%
        </span>
      </p>
    </Card>
  );
};

export default ResultSummary;