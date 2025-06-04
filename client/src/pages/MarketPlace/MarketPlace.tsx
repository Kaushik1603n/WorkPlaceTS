import { useCallback, useEffect, useState } from "react";
import NavigationBar from "../../components/navigationBar/NavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllTheJobs } from "../../features/marketPlace/marketPlaceSlice";
import type { AppDispatch, RootState } from "../../app/store";
import SidebarFilters, { type FilterData } from "./SidebarFilters";
import JobsList from "./JobsList";

export interface Job {
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
    });
    const [debouncedFilters, setDebouncedFilters] = useState<FilterData>(activeFilters);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("MarketPlace mounted");
    }, []);
    const dispatch: AppDispatch = useDispatch();
    const { jobs, pagination } = useSelector((store: RootState) => store.market);

    // useEffect(() => {
    //     dispatch(getAllTheJobs({ page: currentPage, limit: 5, searchQuery: "", filters: activeFilters })).unwrap();
    // }, [dispatch, activeFilters,currentPage]);

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
            page: currentPage, limit: 5,
            searchQuery: debouncedSearchQuery,
            filters: debouncedFilters
        }));
    }, [debouncedSearchQuery, debouncedFilters, currentPage, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(getAllTheJobs({ page: currentPage, limit: 5, searchQuery, filters: activeFilters }));
    };

    const handleFiltersChange = useCallback((filters: FilterData) => {
        setActiveFilters(filters);
    }, []);


    return (
        <div className="bg-gray-50 min-h-screen">
            <NavigationBar />
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-100 h-fit sticky top-8 py-5">
                        <SidebarFilters
                            onFiltersChange={handleFiltersChange}
                            initialFilters={activeFilters}
                        />
                    </div>

                    <JobsList
                        currentPage={pagination.currentPage ?? 1}
                        totalPages={pagination.totalPages ?? 0}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                        jobs={jobs}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default MarketPlace;