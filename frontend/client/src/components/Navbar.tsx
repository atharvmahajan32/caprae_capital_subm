import { Link, useLocation } from "wouter";
import { Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Leads", icon: Users },
    { path: "/sequences", label: "Sequences", icon: Mail },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1 -ml-2" data-testid="link-home">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold">LeadCRM</span>
              </a>
            </Link>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      data-testid={`link-${item.label.toLowerCase()}`}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
