import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Welcome from "./pages/Welcome";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import DishDetail from "./pages/DishDetail";
import Confirmation from "./pages/Confirmation";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Welcome} />
      <Route path={"/menu"} component={Menu} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/dish/:id"} component={DishDetail} />
      <Route path={"/confirmation"} component={Confirmation} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="earthen">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
