import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Algorithms from "./pages/Algorithms";
import Compress from "./pages/Compress";
import Learn from "./pages/Learn";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import HuffmanPractice from "./pages/HuffmanPractice";
import LZWPractice from "./pages/LZWPractice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/algorithms/huffman" element={<HuffmanPractice />} />
          <Route path="/algorithms/lzw" element={<LZWPractice />} />
          <Route path="/compress" element={<Compress />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
