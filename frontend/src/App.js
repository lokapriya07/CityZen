
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- These are the correct imports for App.js ---
import Navigation from "./components/Navigation";
import HomePage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import SignupForm from './components/SignupForm';
import AdminDashboard from "./components/admin/AdminDashboard";
import WorkerDashboard from "./components/worker/WorkerDashboard";
import CitizenDashboard from "./components/citizen/CitizenDashboard";
import ReportForm from "./components/citizen/report-form";
import UploadImage from './components/UploadImage';
import { AuthProvider } from './components/context/AuthContext';
import LearnMore from './components/learnmore';
import 'leaflet/dist/leaflet.css';
// This path is corrected to './components/home/Footer'



function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
      
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* --- All Routes in one place --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/report-issue" element={<UploadImage />} />
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/worker" element={<WorkerDashboard />} />
              <Route path="/citizen/new-report" element={<ReportForm />} />
            </Routes>
          </main>
        
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;