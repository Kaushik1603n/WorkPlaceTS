import type { Job } from "./MarketPlace";
import JobCard from "./JobCard";
import SearchSection from "./SearchSection";
import Pagination from "../../components/Pagination";
import React from "react";

interface JobsListProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    jobs: Job[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

function JobsList({ currentPage, jobs,totalPages, onPageChange, searchQuery, setSearchQuery, handleSubmit }: JobsListProps) {
    return (
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5">
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSubmit={handleSubmit}
            />

            <div className="space-y-6">
                {jobs && jobs.map((job: Job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Pagination
                 currentPage={currentPage || 1}
                totalPages={totalPages }
                onPageChange={onPageChange} />
            </div>
        </main>
    );
}

export default  React.memo(JobsList);