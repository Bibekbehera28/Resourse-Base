import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingBar from "./components/LoadingBar";
import CursorEffect from "./components/CursorEffect";
import Index from "./pages/Index";
import About from "./pages/About";
import Course from "./pages/Course";
import Semester from "./pages/Semester";
import Subject from "./pages/Subject";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LoadingBar />
        <CursorEffect />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/course/:courseId/semester/:semesterId" element={<Semester />} />
          <Route path="/course/:courseId/semester/:semesterId/subject/:subject" element={<Subject />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
