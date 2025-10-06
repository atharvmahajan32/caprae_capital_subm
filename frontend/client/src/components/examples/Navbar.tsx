import Navbar from "../Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8">
          <p className="text-muted-foreground">Page content goes here...</p>
        </div>
      </div>
    </ThemeProvider>
  );
}
