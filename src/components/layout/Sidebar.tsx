
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  LayoutDashboard, 
  Map, 
  Settings, 
  Star, 
  Store
} from "lucide-react";

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  children 
}: { 
  to: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive 
          ? "bg-accent text-primary font-medium" 
          : "text-muted-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
};

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="p-6">
        <h1 className="flex items-center gap-2 font-bold text-2xl text-brand-600">
          <BarChart3 size={24} />
          Review Radar
        </h1>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <SidebarLink to="/" icon={LayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/regions" icon={Map}>
            Regions
          </SidebarLink>
          <SidebarLink to="/branches" icon={Store}>
            Branches
          </SidebarLink>
          <SidebarLink to="/reviews" icon={Star}>
            Reviews
          </SidebarLink>
          <SidebarLink to="/analytics" icon={BarChart3}>
            Analytics
          </SidebarLink>
        </nav>
      </div>
      
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-accent p-1">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Settings</p>
            <p className="text-xs text-muted-foreground">Configure your dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
