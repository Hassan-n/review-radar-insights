
import { Region } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface RegionCardProps {
  region: Region;
}

export function RegionCard({ region }: RegionCardProps) {
  return (
    <Link to={`/regions/${region.code}`}>
      <Card className="h-full hover:shadow-md transition-all cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{region.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Branches</p>
              <p className="text-2xl font-bold">{region.branchCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reviews</p>
              <p className="text-2xl font-bold">{region.reviewCount}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">{region.averageRating.toFixed(1)}</span>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
          {region.description && (
            <p className="mt-4 text-sm text-muted-foreground">
              {region.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
