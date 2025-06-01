import React, { useState, useEffect } from "react";

interface SkillProps {
  onSkillsChange?: (skills: string[]) => void;
  dynamicSkill: string[];
}

function Skill({ onSkillsChange, dynamicSkill }: SkillProps) {
  const [skills, setSkills] = useState<string[]>([...dynamicSkill]);
  const [newSkill, setNewSkill] = useState<string>("");

  useEffect(() => {
    if (onSkillsChange) {
      onSkillsChange(skills);
    }
  }, [skills]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">Skills</label>
      <div className="relative">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill (e.g. React, JavaScript)"
          className="w-full border border-[#27AE60] rounded-md px-3 py-2 focus:ring-green-500 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={addSkill}
          className="absolute right-2 top-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 border border-[#27AE60] rounded-md p-4 w-full">
          <h3 className="text-lg font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1 border border-[#27AE60] rounded-md bg-emerald-50 text-emerald-800 flex items-center"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Skill;