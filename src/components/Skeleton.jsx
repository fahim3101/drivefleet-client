export const CardSkeleton = () => (
  <div className="card-dark overflow-hidden animate-pulse">
    <div className="h-48 bg-white/10" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-white/10 rounded w-1/3" />
      <div className="h-5 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/10 rounded w-1/2" />
      <div className="flex justify-between pt-2">
        <div className="h-6 bg-white/10 rounded w-20" />
        <div className="h-8 bg-white/10 rounded w-24" />
      </div>
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <CardSkeleton key={i} />
      ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-10 bg-white/10 rounded" />
    {Array(4)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="h-16 bg-white/5 rounded" />
      ))}
  </div>
);

export const TextSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 bg-white/10 rounded w-3/4" />
    <div className="h-4 bg-white/10 rounded w-1/2" />
  </div>
);
