import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Cleaned Up Imports (one for each component) ---
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./components/Homepage";
import UploadImage from './components/UploadImage';
import LoginForm from "./components/LoginForm";
import SignupForm from './components/SignupForm';
import AdminDashboard from "./components/admin/AdminDashboard";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      {/* AuthProvider now correctly wraps the entire application */}
      <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* --- All Routes in one place --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/report-issue" element={<UploadImage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;