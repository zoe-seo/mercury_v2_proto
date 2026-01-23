export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 animate-pulse">
      {/* Left Column Skeleton */}
      <div className="h-[400px] bg-gray-200 rounded-xl"></div>
      
      {/* Right Column Skeleton */}
      <div className="space-y-6">
        <div className="h-[200px] bg-gray-200 rounded-xl"></div>
        <div className="h-[300px] bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}
