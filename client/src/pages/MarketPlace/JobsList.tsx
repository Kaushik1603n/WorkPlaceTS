import type { Job } from "./MarketPlace";
import JobCard from "./JobCard";
import SearchSection from "./SearchSection";
import Pagination from "../../components/Pagination";
import React from "react";
import JobCardSkeleton from "./JobCardSkeleton";


interface JobsListProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    jobs: Job[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

function JobsList({ currentPage, jobs, totalPages, onPageChange, searchQuery, setSearchQuery, handleSubmit, isLoading }: JobsListProps) {
    return (
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5">
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSubmit={handleSubmit}
            />

            <div className="space-y-6">
                {isLoading ? (
                    [...Array(2)].map((_, index) => (
                        <JobCardSkeleton key={index} />
                    ))
                ) : (
                    jobs && jobs.map((job: Job) => (
                        <JobCard key={job._id} job={job} />
                    ))
                )}
            </div>

            {!isLoading && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={currentPage || 1}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </main>
    );
}

export default React.memo(JobsList);