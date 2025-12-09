"use client";

export default function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500`}></div>
        {/* Middle spinning ring */}
        <div className={`absolute inset-2 ${sizeClasses[size]} border-2 border-fuchsia-500/20 rounded-full animate-spin border-t-fuchsia-500 animation-delay-150`}></div>
        {/* Inner spinning ring */}
        <div className={`absolute inset-4 ${sizeClasses[size]} border-2 border-orange-500/20 rounded-full animate-spin border-t-orange-500 animation-delay-300`}></div>
        {/* Center dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      {text && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400 animate-pulse">{text}</p>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-0"></div>
            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton loading component
export function SkeletonLoader({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg animate-shimmer"
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.2}s`
          }}
        ></div>
      ))}
    </div>
  );
}

// Card skeleton loader
export function CardSkeletonLoader() {
  return (
    <div className="frosted-card rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl animate-shimmer"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-shimmer w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-shimmer w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-shimmer"></div>
        <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-shimmer w-5/6"></div>
      </div>
    </div>
  );
}

// Page loading wrapper
export function PageLoading({ text = "Loading..." }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-8">
        <LoadingSpinner size="xl" text={text} />
        <div className="max-w-md">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
