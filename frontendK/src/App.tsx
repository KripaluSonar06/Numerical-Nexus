import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompletionProvider } from "./contexts/CompletionContext";
import HomePage from "./pages/HomePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssignmentDetailsPage from "./pages/AssignmentDetailsPage";
import QuestionPage from "./pages/QuestionPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFound from "./pages/NotFound";
import TauSlider from "./pages/TauSlider";
import S3_2PlotPage from "./pages/s3_2PlotPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompletionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/assignment/:assignmentId" element={<AssignmentDetailsPage />} />
            <Route path="/assignment/:assignmentId/question/:questionId" element={<QuestionPage />} />
            <Route path="/slider" element={<TauSlider />} />
            <Route path="/s3_2_plot" element={<S3_2PlotPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CompletionProvider>
  </QueryClientProvider>
);

export default App;
