
import { Review } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ReviewItemProps {
  review: Review;
  showBranch?: boolean;
}

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

export function ReviewItem({ review, showBranch = true }: ReviewItemProps) {
  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          {showBranch && (
            <Link 
              to={`/branches/${review.branchId}`}
              className="font-medium text-primary hover:underline"
            >
              {review.branchName}
            </Link>
          )}
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={review.rating} />
            <Badge className={getSentimentColor(review.sentiment)}>
              {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
            </Badge>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
        </span>
      </div>
      
      <p className="mt-2 text-sm">{review.content}</p>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {review.customerName || "Anonymous Customer"}
      </div>
    </div>
  );
}
