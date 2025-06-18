import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  t: {
    pageTitle: string;
    loading: string;
  };
}

export function LoadingSkeleton({ t }: LoadingSkeletonProps) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.loading}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}