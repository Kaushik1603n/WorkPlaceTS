import { useCallback, useEffect, useState } from "react";
import {
    Search,
    // Filter,
    // ArrowDown,
    // Star,
    // Users,
    // MessageCircle,
} from "lucide-react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllTheJobs } from "../../features/marketPlace/marketPlaceSlice";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store"; // Adjust the path as needed
import SidebarFilters, { type FilterData } from "./SidebarFilters";

interface Job {
    _id: string;
    title: string;
    stack: string;
    createdAt: string;
    description: string;
    skills: string[];
    budget: number;
    proposals: string[];
}

function MarketPlace() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");


    const [activeFilters, setActiveFilters] = useState<FilterData>({
        priceRange: [0, 1000],
        selectedJobTypes: [],
        selectedSkills: [],
        experienceLevel: [],
        projectDuration: []
    });
    const [debouncedFilters, setDebouncedFilters] = useState<FilterData>(activeFilters);


    const dispatch: AppDispatch = useDispatch();
    const { jobs } = useSelector((store: RootState) => store.market);


    useEffect(() => {
        dispatch(getAllTheJobs({ searchQuery: "", filters: activeFilters })).unwrap();
    }, [dispatch]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => {
            clearTimeout(timerId);
        };
    }, [searchQuery]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedFilters(activeFilters);
        }, 300);
        return () => clearTimeout(timerId);
    }, [activeFilters]);

    useEffect(() => {
        dispatch(getAllTheJobs({
            searchQuery: debouncedSearchQuery,
            filters: debouncedFilters
        }));
    }, [debouncedSearchQuery, debouncedFilters, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(getAllTheJobs({ searchQuery, filters: activeFilters }));
    };

    const handleFiltersChange = useCallback((filters: FilterData) => {
        setActiveFilters(filters);
    }, []);


    return (
        <div className="bg-gray-50 min-h-screen">
            <NavigationBar />
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8 ">
                    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-100 h-fit sticky top-8 py-5">
                        <SidebarFilters
                            onFiltersChange={handleFiltersChange}
                            initialFilters={activeFilters} />
                    </div>

                    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 ">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 px-4 py-6">
                            <div className="relative w-full md:w-[600px]">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-3 pl-10 pr-10 border border-[#27AE60] rounded-full bg-white focus:outline-none"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                    <Search size={18} />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full"
                                >
                                    <Search size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* <div className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSkillOpen(!isSkillOpen)}
                                        className="px-4 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-50 transition-colors"
                                    >
                                        Skill <span className="ml-1">›</span>
                                    </button>
                                    {isSkillOpen && (
                                        <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                                            {skills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm text-gray-700"
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-50 transition-colors">
                                    Price Range <span className="ml-1">›</span>
                                </button>
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-full hover:bg-green-50 transition-colors">
                                    Job Type <span className="ml-1">›</span>
                                </button>
                            </div> */}
                        </div>

                        <div className="space-y-6">
                            {jobs && jobs.map((job: Job) => (
                                <div
                                    key={job._id}
                                    className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition duration-150"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {job.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {job.stack} Stack · Posted{" "}
                                                {new Date(job.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="mt-2 sm:mt-0">
                                            <Link
                                                to={`job-details/${job._id}`}
                                                className="bg-green-100 text-green-600 hover:bg-green-200 px-4 py-2 rounded-md text-sm font-medium"
                                            >
                                                View Job
                                            </Link>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-gray-700 line-clamp-2">
                                        {job.description}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-semibold text-gray-700">
                                                ${job.budget}
                                            </h3>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {job?.proposals?.length} proposals
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8">
                            {/* <Pagination /> */}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default MarketPlace;