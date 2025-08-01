import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-6xl px-3 sm:px-8 py-8 sm:py-12">
      <div className="space-y-8 sm:space-y-12">
        {/* Category skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-md mb-4 sm:mb-6 w-48 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-blue-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Second category skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-md mb-4 sm:mb-6 w-40 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-blue-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;