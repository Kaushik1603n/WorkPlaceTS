import React, { useCallback, useState, type ChangeEvent, } from "react";
import JobSkills from "./JobSkills";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createNewJob } from "../../../features/clientFeatures/project/projectSlice";
import { type AppDispatch } from "../../../app/store"; // You may need to adjust this path based on your store setup

interface FormData {
  jobTitle: string;
  description: string;
  requiredFeatures: string;
  stack: string;
  skills: string[];
  time: string;
  budgetType: "fixed" | "hourly";
  budget: string;
  experienceLevel: "entry" | "intermediate" | "expert";
  reference: string;
}

function JobPostingForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    description: "",
    requiredFeatures: "",
    stack: "",
    skills: [],
    time: "",
    budgetType: "fixed",
    budget: "",
    experienceLevel: "entry",
    reference: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioChange = <K extends keyof FormData>(name: K, value: FormData[K]) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSkillsChange = useCallback((updatedSkills: string[]) => {
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {
      jobTitle,
      description,
      requiredFeatures,
      stack,
      skills,
      time,
      budgetType,
      budget,
      experienceLevel,
      reference,
    } = formData;

    if (!jobTitle.trim()) {
      toast.error("Job Title is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Job description is required.");
      return;
    }
    if (!requiredFeatures.trim()) {
      toast.error("Features is required.");
      return;
    }
    if (!stack.trim()) {
      toast.error("stack is required.");
      return;
    }
    if (skills.length < 1) {
      toast.error("Minimum One skill is required.");
      return;
    }
    if (!time.trim()) {
      toast.error("Time is required.");
      return;
    }
    if (!budgetType.trim()) {
      toast.error("Budget Type is required.");
      return;
    }
    if (Number(budget) < 1) {
      toast.error("Enter valid budget");
      return;
    }
    if (!experienceLevel.trim()) {
      toast.error("experience level is required.");
      return;
    }
    if (!reference.trim()) {
      toast.error("reference is required.");
      return;
    }
    const urlRegex = /^(https?:\/\/)([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    if (!urlRegex.test(reference)) {
      toast.error("Enter a valid website URL.");
      return;
    }

    dispatch(createNewJob(formData))
      .unwrap()
      .then(() => {
        toast.success("project created successfully");
        setFormData(
          {
            jobTitle: "",
            description: "",
            requiredFeatures: "",
            stack: "",
            skills: [],
            time: "",
            budgetType: "fixed",
            budget: "",
            experienceLevel: "entry",
            reference: "",
          }
        )
      })
      .catch((error) => {
        console.log(error?.error);
        toast.error(error?.error);
      });
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-s-lg border border-[#27AE60] p-5">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter Your Job Title"
              className="w-full px-4 py-2 border border-[#27AE60] rounded-md focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Your Job Description"
              className="w-full px-4 py-2 border border-[#27AE60] rounded-md focus:outline-none  h-32"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Required Features / Pages
            </label>
            <textarea
              name="requiredFeatures"
              value={formData.requiredFeatures}
              onChange={handleChange}
              placeholder="Enter Your Job Required Features / Pages"
              className="w-full px-4 py-2 border border-[#27AE60] rounded-md focus:outline-none  h-24"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Stack
            </label>
            <input
              type="text"
              name="stack"
              value={formData.stack}
              onChange={handleChange}
              placeholder="Enter Your web Stack"
              className="w-full px-4 py-2 border border-[#27AE60] rounded-md focus:outline-none "
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Time</label>
            <div className="relative">
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="Enter Your Job Duration"
                className="w-full px-4 py-2 pl-10 border border-[#27AE60] rounded-md focus:outline-none "
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Budget Type
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="fixed"
                  checked={formData.budgetType === "fixed"}
                  onChange={() => handleRadioChange("budgetType", "fixed")}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-[#27AE60]"
                />
                <label htmlFor="fixed" className="ml-2 text-gray-700">
                  fixed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hourly"
                  checked={formData.budgetType === "hourly"}
                  onChange={() => handleRadioChange("budgetType", "hourly")}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-[#27AE60]"
                />
                <label htmlFor="hourly" className="ml-2 text-gray-700">
                  hourly
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Budget
            </label>
            <div className="relative">
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter Your Job Budget"
                className="w-full px-4 py-2 pl-10 border border-[#27AE60] rounded-md focus:outline-none "
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-400 font-semibold text-lg">₹</span>
              </div>
            </div>
          </div>

          <JobSkills onSkillsChange={handleSkillsChange} />
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Experience Level
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="entry"
                  checked={formData.experienceLevel === "entry"}
                  onChange={() => handleRadioChange("experienceLevel", "entry")}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-[#27AE60]"
                />
                <label htmlFor="entry" className="ml-2 text-gray-700">
                  entry
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="intermediate"
                  checked={formData.experienceLevel === "intermediate"}
                  onChange={() =>
                    handleRadioChange("experienceLevel", "intermediate")
                  }
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-[#27AE60]"
                />
                <label htmlFor="intermediate" className="ml-2 text-gray-700">
                  intermediate
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="expert"
                  checked={formData.experienceLevel === "expert"}
                  onChange={() =>
                    handleRadioChange("experienceLevel", "expert")
                  }
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-[#27AE60]"
                />
                <label htmlFor="expert" className="ml-2 text-gray-700">
                  expert
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Reference
            </label>
            <div className="relative">
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Enter Your Job Reference"
                className="w-full px-4 py-2 pl-10 border border-[#27AE60] rounded-md focus:outline-none "
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobPostingForm;