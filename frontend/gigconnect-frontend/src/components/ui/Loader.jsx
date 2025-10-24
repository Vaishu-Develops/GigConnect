// components/ui/Loader.jsx
import React from 'react'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin`}
      ></div>
    </div>
  )
}

export const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mb-4" />
        <p className="text-emerald-700 font-medium">Loading GigConnect...</p>
      </div>
    </div>
  )
}

export const LoadingCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="p-6 space-y-4">
        <div className="shimmer h-4 rounded w-3/4"></div>
        <div className="shimmer h-4 rounded w-1/2"></div>
        <div className="shimmer h-4 rounded w-5/6"></div>
        <div className="flex space-x-2">
          <div className="shimmer h-6 rounded-full w-16"></div>
          <div className="shimmer h-6 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  )
}

export { LoadingSpinner };
export default LoadingSpinner;