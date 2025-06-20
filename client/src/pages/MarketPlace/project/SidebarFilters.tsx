import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FilterSection = 'priceRange' | 'jobType' | 'skills' | 'experience' | 'duration';

export type FilterData = {
    priceRange: [number, number];
    selectedJobTypes: string[];
    selectedSkills: string[];
    experienceLevel: string[];
};

interface SidebarFiltersProps {
    onFiltersChange: (filters: FilterData) => void;
    initialFilters?: FilterData;
}


const SidebarFilters: React.FC<SidebarFiltersProps> = ({
    onFiltersChange,
    initialFilters
}) => {
    // Filter states
    const [priceRange, setPriceRange] = useState<[number, number]>(
        initialFilters?.priceRange || [0, 10000]
    );
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(
        initialFilters?.selectedJobTypes || []
    );
    const [selectedSkills, setSelectedSkills] = useState<string[]>(
        initialFilters?.selectedSkills || []
    );
    const [experienceLevel, setExperienceLevel] = useState<string[]>(
        initialFilters?.experienceLevel || []
    );
    // const [projectDuration, setProjectDuration] = useState<string[]>(
    //     initialFilters?.projectDuration || []
    // );

     useEffect(() => {
      onFiltersChange({
        priceRange,
        selectedJobTypes,
        selectedSkills,
        experienceLevel,
        
      });
    }, [priceRange, selectedJobTypes, selectedSkills, experienceLevel,  onFiltersChange]);

    // Expanded states for filter sections
    const [expandedSections, setExpandedSections] = useState<Record<FilterSection, boolean>>({
        priceRange: true,
        jobType: true,
        skills: true,
        experience: true,
        duration: true
    });

    // Sample data
    const skills: string[] = ['React', 'Node.js', 'Python', 'JavaScript', 'PHP', 'Laravel', 'Vue.js', 'Angular', 'MongoDB', 'Express.js'];
    const jobTypes: string[] = ['Fixed', 'Hourly'];
    const experienceLevels: string[] = ['Entry', 'Intermediate', 'Expert'];
    // const durations: string[] = ['Less than 1 month', '1-3 months', '3-6 months', '6+ months'];

    const toggleSection = (section: FilterSection) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCheckboxChange = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        currentArray: string[]
    ) => {
        if (currentArray.includes(value)) {
            setter(currentArray.filter(item => item !== value));
        } else {
            setter([...currentArray, value]);
        }
    };

    const clearAllFilters = () => {
        setPriceRange([0, 10000]);
        setSelectedJobTypes([]);
        setSelectedSkills([]);
        setExperienceLevel([]);
    };

    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('priceRange')}
                    className="flex justify-between items-center w-full text-left mb-3"
                >
                    <h3 className="font-medium text-gray-900">Price Range</h3>
                    {expandedSections.priceRange ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections.priceRange && (
                    <div>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full accent-green-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>$0</span>
                            <span>$10,00+</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Job Type Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('jobType')}
                    className="flex justify-between items-center w-full text-left mb-3"
                >
                    <h3 className="font-medium text-gray-900">Job Type</h3>
                    {expandedSections.jobType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections.jobType && (
                    <div className="space-y-2">
                        {jobTypes.map((type) => (
                            <label key={type} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedJobTypes.includes(type)}
                                    onChange={() => handleCheckboxChange(type, setSelectedJobTypes, selectedJobTypes)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-1"
                                />
                                <span className="ml-2 text-sm text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('skills')}
                    className="flex justify-between items-center w-full text-left mb-3"
                >
                    <h3 className="font-medium text-gray-900">Skills</h3>
                    {expandedSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections.skills && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {skills.map((skill) => (
                            <label key={skill} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => handleCheckboxChange(skill, setSelectedSkills, selectedSkills)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-1"
                                />
                                <span className="ml-2 text-sm text-gray-700">{skill}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Experience Level Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('experience')}
                    className="flex justify-between items-center w-full text-left mb-3"
                >
                    <h3 className="font-medium text-gray-900">Experience Level</h3>
                    {expandedSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections.experience && (
                    <div className="space-y-2">
                        {experienceLevels.map((level) => (
                            <label key={level} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={experienceLevel.includes(level)}
                                    onChange={() => handleCheckboxChange(level, setExperienceLevel, experienceLevel)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-1"
                                />
                                <span className="ml-2 text-sm text-gray-700">{level}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

           
        </div>
    );
};

export default  React.memo(SidebarFilters);