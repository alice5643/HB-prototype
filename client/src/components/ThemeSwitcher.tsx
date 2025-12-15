import { useTheme, Theme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 opacity-50 hover:opacity-100 transition-opacity">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("earthen")}>
          <span className={theme === "earthen" ? "font-bold" : ""}>Earthen Elegance</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("nocturnal")}>
          <span className={theme === "nocturnal" ? "font-bold" : ""}>Nocturnal Noir</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("botanical")}>
          <span className={theme === "botanical" ? "font-bold" : ""}>Botanical Breeze</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
