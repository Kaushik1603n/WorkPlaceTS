import { Search } from "lucide-react";
import type{ FormEvent } from "react";

interface SearchSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSubmit: (e: FormEvent) => void;
}

function SearchSection({ searchQuery, setSearchQuery, handleSubmit }: SearchSectionProps) {
    return (
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
        </div>
    );
}

export default SearchSection;