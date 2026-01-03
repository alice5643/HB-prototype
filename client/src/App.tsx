import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Welcome from "./pages/Welcome";
import MenuList from "./pages/MenuList";
import Dashboard from "./pages/Dashboard";
import MenuDiscovery from "./pages/MenuDiscovery";
import OrderSummary from "./pages/OrderSummary";
import DiningStatus from "./pages/DiningStatus";
import Service from "./pages/Service";
import Payment from "./pages/Payment";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import DishDetail from "./pages/DishDetail";
import StaffDashboard from './pages/StaffDashboard';
import ConsoleDashboard from './pages/console/Dashboard';
import ConsoleVenue from './pages/console/Venue';
import ConsoleStaff from './pages/console/Staff';
import ConsoleMenu from './pages/console/Menu';

import Compare from "./pages/Compare";
import OrderDraft from "./pages/OrderDraft";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Welcome} />
      <Route path={"/dashboard"} component={DiningStatus} />
      <Route path={"/menus"} component={MenuList} />
      <Route path={"/discovery"} component={MenuDiscovery} />
      <Route path={"/order-summary"} component={OrderSummary} />
      <Route path={"/dining-status"} component={DiningStatus} />
      <Route path={"/service"} component={Service} />
      <Route path={"/payment"} component={Payment} />
      <Route path={"/menu/:type"} component={Menu} />
      <Route path={"/gallery/:type"} component={Gallery} />
      <Route path={"/compare/:id1/:id2"} component={Compare} />
      <Route path={"/order-draft"} component={OrderDraft} />
      <Route path={"/dish/:id"} component={DishDetail} />
       <Route path="/staff" component={StaffDashboard} />
      
      {/* Console Routes */}
      <Route path="/console" component={() => (
        <div className="console-layout-wrapper">
          <ConsoleDashboard />
        </div>
      )} />
      <Route path="/console/venue" component={() => (
        <div className="console-layout-wrapper">
          <ConsoleVenue />
        </div>
      )} />
      <Route path="/console/staff" component={() => (
        <div className="console-layout-wrapper">
          <ConsoleStaff />
        </div>
      )} />
      <Route path="/console/menu" component={() => (
        <div className="console-layout-wrapper">
          <ConsoleMenu />
        </div>
      )} />

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
