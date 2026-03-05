import React from "react";
import Card from "../common/Card";

const SectionScoreCard = ({ title, score, maxScore }) => {
  return (
    <Card>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">{title}</h3>

        <span className="text-blue-600 font-bold">
          {score} / {maxScore}
        </span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{
            width: `${(score / maxScore) * 100}%`,
          }}
        />
      </div>
    </Card>
  );
};

export default SectionScoreCard;