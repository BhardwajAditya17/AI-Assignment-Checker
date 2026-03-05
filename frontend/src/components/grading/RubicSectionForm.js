import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card";

const RubricSectionForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [maxScore, setMaxScore] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !maxScore) return;

    onAdd({
      title,
      maxScore: Number(maxScore),
    });

    setTitle("");
    setMaxScore("");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Section Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Code Quality"
        />

        <Input
          label="Maximum Score"
          type="number"
          value={maxScore}
          onChange={(e) => setMaxScore(e.target.value)}
          placeholder="e.g., 10"
        />

        <Button type="submit" fullWidth>
          Add Section
        </Button>
      </form>
    </Card>
  );
};

export default RubricSectionForm;