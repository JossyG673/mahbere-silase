"use client";

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow border border-sand/30">
      <div className="skeleton h-11 w-11 rounded-xl mb-3" />
      <div className="skeleton h-7 w-28 rounded mb-2" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-1">
          <div className="skeleton h-9 w-9 rounded-full flex-shrink-0" />
          <div className="skeleton h-4 flex-1 rounded" />
          <div className="skeleton h-4 w-24 rounded hidden md:block" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="skeleton h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="skeleton h-9 w-9 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-3 w-16 rounded mb-1.5" />
              <div className="skeleton h-4 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
