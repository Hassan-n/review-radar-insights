
import { Branch } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
    <Link to={`/branches/${branch.id}`}>
      <Card className="h-full hover:shadow-md transition-all cursor-pointer">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">{branch.name}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {branch.regionName}
            </Badge>
          </div>
          <div className="flex items-center gap-1 bg-brand-50 px-2 py-1 rounded-md">
            <span className="font-bold">{branch.averageRating.toFixed(1)}</span>
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{branch.address}</p>
                <p className="text-sm">{branch.city}</p>
              </div>
            </div>
            
            {branch.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{branch.phone}</p>
              </div>
            )}
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Reviews</p>
              <p className="font-bold">{branch.reviewCount} reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
