export default function ShimmerBlock({ className = "" }: { className?: string }) {
  return <div className={`shimmer ${className}`} />;
}

export function ShimmerRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="shimmer w-8 h-8 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-4 rounded-md" style={{ width: `${60 + Math.random() * 30}%` }} />
            <div className="shimmer h-3 rounded-md" style={{ width: `${40 + Math.random() * 20}%` }} />
          </div>
          <div className="shimmer w-12 h-4 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ShimmerCard() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="shimmer h-5 w-1/3 rounded-md" />
      <div className="shimmer h-4 w-2/3 rounded-md" />
      <div className="shimmer h-4 w-1/2 rounded-md" />
      <div className="flex gap-2 pt-2">
        <div className="shimmer h-6 w-16 rounded-full" />
        <div className="shimmer h-6 w-20 rounded-full" />
        <div className="shimmer h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}
