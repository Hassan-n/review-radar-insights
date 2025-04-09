
import { Review } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
    case "neutral":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
    case "negative":
      return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
    default:
      return "";
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export function RecentReviews() {
  const { data: reviews, isLoading, error } = useRecentReviews(5);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load recent reviews.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 border-b pb-4 last:border-0">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[70px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews?.map((review) => (
              <div key={review.id} className="flex flex-col gap-1 border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/branches/${review.branchId}`}
                    className="font-medium hover:underline"
                  >
                    {review.branchName}
                  </Link>
                  <Badge className={getSentimentColor(review.sentiment)}>
                    {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{review.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {review.customerName || "Anonymous"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
