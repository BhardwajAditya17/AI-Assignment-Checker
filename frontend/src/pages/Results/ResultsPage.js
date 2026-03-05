import React from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import SectionScoreCard from "../../components/grading/SectionScoreCard";
import ResultSummary from "../../components/grading/ResultSummary";

const ResultsPage = () => {
  const sections = [
    { title: "Code Quality", score: 8, maxScore: 10 },
    { title: "Logic Implementation", score: 15, maxScore: 20 },
    { title: "Documentation", score: 7, maxScore: 10 },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">
            Assignment Result
          </h2>

          <div className="space-y-4 mb-6">
            {sections.map((sec, index) => (
              <SectionScoreCard
                key={index}
                title={sec.title}
                score={sec.score}
                maxScore={sec.maxScore}
              />
            ))}
          </div>

          <ResultSummary sections={sections} />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;