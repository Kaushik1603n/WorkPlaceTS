import React from "react";

const ProposalDetailsSkeleton: React.FC = () => {
  return (
    <div className="p-2 min-h-screen animate-pulse">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {/* Header Skeleton */}
        <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="bg-gray-200 rounded-full p-1 flex">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-8 w-24 bg-gray-300 rounded-full mx-1"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="bg-gray-100 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow md:w-2/3 p-5 md:border-r border-gray-200">
            {/* Cover Letter Skeleton */}
            <div className="mb-8 space-y-3">
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((line) => (
                  <div key={line} className="h-4 bg-gray-300 rounded w-full"></div>
                ))}
              </div>
            </div>

            {/* Milestones Skeleton */}
            <div className="mb-8">
              <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr>
                      {[1, 2, 3, 4].map((th) => (
                        <th key={th} className="h-10 bg-gray-200 px-4">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((row) => (
                      <tr key={row} className="border-b border-gray-200">
                        {[1, 2, 3, 4].map((cell) => (
                          <td key={cell} className="h-12 px-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="w-full md:w-1/3 p-5 bg-gray-100">
            {/* Skills Skeleton */}
            <div className="mb-6">
              <div className="h-6 w-24 bg-gray-300 rounded mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((skill) => (
                  <div key={skill} className="h-6 w-16 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Metrics Skeleton */}
            <div className="mb-6">
              <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((metric) => (
                  <div key={metric} className="bg-gray-200 rounded-lg p-3">
                    <div className="h-6 w-12 bg-gray-300 rounded mx-auto"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded mt-2 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="mb-6">
              <div className="h-6 w-20 bg-gray-300 rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsSkeleton;