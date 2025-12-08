import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <main className="md:ml-62  ">
      <div className="space-y-6 p-4 shadow-md animate-pulse ">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>

        {/* Form Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />

          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-24 w-full md:col-span-2 rounded-md" />

          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

        {/* Button */}
        <Skeleton className="h-12 w-48 rounded-md" />
      </div>
    </main>
  );
}
