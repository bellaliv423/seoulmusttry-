import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import MapPage from "./pages/MapPage";
import MealBuddyPage from "./pages/MealBuddyPage";
import MealBuddyPostDetail from "./pages/MealBuddyPostDetail";
import ProfilePage from "./pages/ProfilePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurant/:id" component={RestaurantDetail} />
      <Route path="/map" component={MapPage} />
      <Route path="/meal-buddy" component={MealBuddyPage} />
      <Route path="/meal-buddy/:id" component={MealBuddyPostDetail} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Navbar />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
