// projectSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="border rounded-lg bg-background">
      <div className="grid grid-cols-12 items-center px-4 py-2 font-medium border-b">
        <div className="col-span-1"><Skeleton className="h-4 w-4 rounded-full" /></div>
        <div className="col-span-4"><Skeleton className="h-4 w-32" /></div>
        <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
        <div className="col-span-2"><Skeleton className="h-4 w-20" /></div>
        <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
        <div className="col-span-1"><Skeleton className="h-4 w-4 rounded-full" /></div>
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/50 transition-colors">
          <div className="col-span-1"><Skeleton className="h-4 w-4 rounded-full" /></div>
          <div className="col-span-4 flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
          <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
          <div className="col-span-2 flex items-center gap-2">
            <Skeleton className="h-2 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="col-span-1 flex justify-end"><Skeleton className="h-4 w-4 rounded-full" /></div>
        </div>
      ))}
    </div>
  );
}