import React from 'react';

export const LoadingSkeleton = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex flex-col items-center">
    {/* Hero Section Skeleton */}
    <section className="w-full flex flex-col md:flex-row items-center justify-between px-3 sm:px-4 md:px-8 py-10 sm:py-16 md:py-20 max-w-6xl mx-auto gap-8">
      <div className="flex-1 text-center md:text-left">
        <div className="h-12 bg-blue-200 rounded mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="h-10 bg-blue-600 rounded w-48 mx-auto md:mx-0 animate-pulse"></div>
      </div>
    </section>
    
    {/* Trust Badges Skeleton */}
    <section className="w-full max-w-4xl px-3 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col items-center text-center">
          <div className="w-7 h-7 bg-blue-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      ))}
    </section>
    
    {/* Categories Skeleton */}
    <section className="w-full max-w-6xl px-3 sm:px-8 py-8 sm:py-12">
      <div className="h-8 bg-blue-200 rounded mb-8 w-1/3 mx-auto animate-pulse"></div>
      <div className="space-y-8 sm:space-y-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-8">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default LoadingSkeleton;