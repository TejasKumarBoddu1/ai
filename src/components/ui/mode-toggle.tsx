
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

export function ModeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-5 w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
