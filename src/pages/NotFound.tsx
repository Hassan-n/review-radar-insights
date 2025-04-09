
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex justify-center py-12">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Oops! The page you're looking for can't be found.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
