import { useEffect, useState } from "react";
import {
    Search,
    // Filter,
    // ArrowDown,
    // Star,
    // Users,
    // MessageCircle,
} from "lucide-react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllTheJobs } from "../../features/marketPlace/marketPlaceSlice";
import { Link } from "react-router-dom";
// import { AppDispatch, RootState } from "../../app/store"; // Adjust the path as needed

interface Job {
    _id: string;
    title: string;
    stack: string;
    createdAt: string;
    description: string;
    skills: string[];
    budget: number;
    proposals: number; // Replace 'any' with a proper type if you have the proposal structure
}

function MarketPlace() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [isSkillOpen, setIsSkillOpen] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>([
        {
            _id: "1",
            title: "React Developer Needed",
            stack: "MERN",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            description: "We need an experienced React developer to build a responsive e-commerce dashboard with modern UI components and state management.",
            skills: ["React", "TypeScript", "Redux", "Material-UI"],
            budget: 2500,
            proposals: 12
        },
        {
            _id: "2",
            title: "Full Stack Node.js Project",
            stack: "MEAN",
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            description: "Looking for a full-stack developer to build a REST API with Node.js and MongoDB, and integrate it with an Angular frontend.",
            skills: ["Node.js", "Express", "MongoDB", "Angular"],
            budget: 3500,
            proposals: 8
        },
        {
            _id: "3",
            title: "Mobile App with React Native",
            stack: "React Native",
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            description: "Development of a cross-platform mobile application for both iOS and Android using React Native with Firebase backend integration.",
            skills: ["React Native", "Firebase", "JavaScript", "Redux"],
            budget: 4200,
            proposals: 15
        },
        {
            _id: "4",
            title: "Python Data Analysis",
            stack: "Python",
            createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            description: "Need a data scientist to analyze large datasets and create visualizations using Python libraries like Pandas, NumPy, and Matplotlib.",
            skills: ["Python", "Pandas", "NumPy", "Data Visualization"],
            budget: 1800,
            proposals: 5
        },
        {
            _id: "5",
            title: "WordPress E-commerce Site",
            stack: "WordPress",
            createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            description: "Setup and customization of a WooCommerce store with custom theme development and payment gateway integration.",
            skills: ["WordPress", "WooCommerce", "PHP", "CSS"],
            budget: 1200,
            proposals: 7
        }
    ]);


    //   const dispatch: AppDispatch = useDispatch();
    //   const { jobs } = useSelector((store: RootState) => store.market);

    const skills: string[] = ["Node.js", "React", "MongoDB", "Express.js"];

    //   useEffect(() => {
    //     dispatch(getAllTheJobs()).unwrap();
    //   }, [dispatch]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchQuery]);

    //   useEffect(() => {
    //     dispatch(getAllTheJobs(debouncedSearchQuery));
    //   }, [debouncedSearchQuery, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // dispatch(getAllTheJobs(searchQuery));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <NavigationBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                    <div className="flex flex-wrap gap-2">
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
                    </div>
                </div>

                <div className="space-y-6">
                    {jobs.map((job: Job) => (
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

                            <p className="mt-3 text-gray-700 truncate">{job.description}</p>

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
                                    {job.proposals} proposals
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            1
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-600 hover:bg-green-100"
                        >
                            2
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                        </span>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            8
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            9
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            10
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </nav>
                </div>
            </main>
        </div>
    );
}

export default MarketPlace;