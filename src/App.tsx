import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Appointments from "./pages/Appointments.tsx";
import Records from "./pages/Records.tsx";
import Doctors from "./pages/Doctors.tsx";
import Patients from "./pages/Patients.tsx";
import PatientDetail from "./pages/PatientDetail.tsx";
import RegisterPatient from "./pages/RegisterPatient.tsx";
import Clerks from "./pages/Clerks.tsx";
import Availability from "./pages/Availability.tsx";
import Facilities from "./pages/Facilities.tsx";
import Integrations from "./pages/Integrations.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const msg = (error as Error)?.message?.toLowerCase() ?? "";
        // Don't retry auth/permission errors
        if (msg.includes("unauthorized") || msg.includes("forbidden") || msg.includes("not found")) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/dashboard/records" element={<ProtectedRoute roles={["patient"]}><Records /></ProtectedRoute>} />
            <Route path="/dashboard/doctors" element={<ProtectedRoute roles={["patient", "admin"]}><Doctors /></ProtectedRoute>} />
            <Route path="/dashboard/patients" element={<ProtectedRoute roles={["doctor", "admin", "clerk"]}><Patients /></ProtectedRoute>} />
            <Route path="/dashboard/patients/new" element={<ProtectedRoute roles={["admin", "clerk"]}><RegisterPatient /></ProtectedRoute>} />
            <Route path="/dashboard/patients/:id" element={<ProtectedRoute roles={["doctor", "admin", "clerk"]}><PatientDetail /></ProtectedRoute>} />
            <Route path="/dashboard/availability" element={<ProtectedRoute roles={["doctor"]}><Availability /></ProtectedRoute>} />
            <Route path="/dashboard/facilities" element={<ProtectedRoute><Facilities /></ProtectedRoute>} />
            <Route path="/dashboard/clerks" element={<ProtectedRoute roles={["admin"]}><Clerks /></ProtectedRoute>} />
            <Route path="/dashboard/integrations" element={<ProtectedRoute roles={["admin"]}><Integrations /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
