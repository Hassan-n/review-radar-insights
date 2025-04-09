
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { useBranch } from "@/hooks/useBranches";
import { useBranchReviews } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Star, Mail, Building } from "lucide-react";
import { ReviewItem } from "@/components/reviews/ReviewItem";
import { RatingDistribution } from "@/types";
import { RatingChart } from "@/components/dashboard/RatingChart";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { Badge } from "@/components/ui/badge";

export default function BranchDetailPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const { data: branch, isLoading: branchLoading } = useBranch(branchId);
  const { data: reviews, isLoading: reviewsLoading } = useBranchReviews(branchId || "");
  
  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!reviews) return [];
    
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      counts[review.rating] += 1;
    });
    
    const result: RatingDistribution[] = [];
    for (let i = 1; i <= 5; i++) {
      result.push({
        rating: i,
        count: counts[i],
        percentage: reviews.length ? (counts[i] / reviews.length) * 100 : 0
      });
    }
    
    return result;
  };
  
  // Calculate sentiment distribution
  const getSentimentDistribution = () => {
    if (!reviews) return [];
    
    const counts: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
    reviews.forEach(review => {
      counts[review.sentiment] += 1;
    });
    
    return [
      {
        sentiment: 'positive' as const,
        count: counts.positive,
        percentage: reviews.length ? (counts.positive / reviews.length) * 100 : 0
      },
      {
        sentiment: 'neutral' as const,
        count: counts.neutral,
        percentage: reviews.length ? (counts.neutral / reviews.length) * 100 : 0
      },
      {
        sentiment: 'negative' as const,
        count: counts.negative,
        percentage: reviews.length ? (counts.negative / reviews.length) * 100 : 0
      }
    ];
  };
  
  const ratingDistribution = getRatingDistribution();
  const sentimentDistribution = getSentimentDistribution();
  
  return (
    <Layout>
      <PageHeader 
        title={branchLoading ? "Loading..." : branch?.name || "Branch Not Found"} 
        backLink="/branches"
      />
      
      {branchLoading ? (
        <Skeleton className="h-[200px] w-full mb-6" />
      ) : branch ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <h3 className="text-lg font-semibold">Branch Information</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{branch.address}</p>
                    <p className="text-muted-foreground">{branch.city}</p>
                  </div>
                </div>
                
                {branch.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{branch.phone}</p>
                    </div>
                  </div>
                )}
                
                {branch.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{branch.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Region</p>
                    <Link to={`/regions/${branch.regionId}`}>
                      <Badge variant="outline" className="mt-1 hover:bg-accent">
                        {branch.regionName}
                      </Badge>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Reviews Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-2xl font-bold">{branch.averageRating.toFixed(1)}</span>
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{branch.reviewCount}</p>
                </div>
                
                <Button asChild className="mt-2">
                  <Link to="/reviews" className="w-full">View All Reviews</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center my-12">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-medium mb-2">Branch Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The branch you're looking for doesn't exist or has been moved.
              </p>
              <Button asChild>
                <Link to="/branches">Back to All Branches</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {branch && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <RatingChart data={ratingDistribution} isLoading={reviewsLoading} />
            <SentimentChart data={sentimentDistribution} isLoading={reviewsLoading} />
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-bold">Recent Reviews</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-[100px] w-full" />
                  ))}
                </div>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">This branch has no reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {reviews?.slice(0, 10).map((review) => (
                    <ReviewItem key={review.id} review={review} showBranch={false} />
                  ))}
                  
                  {(reviews?.length || 0) > 10 && (
                    <div className="pt-4 text-center">
                      <Button asChild variant="outline">
                        <Link to="/reviews">View All Reviews</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  );
}
