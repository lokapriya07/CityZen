// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Navigation from "./components/Navigation";
// import Footer from "./components/Footer";
// import HomePage from "./components/Homepage";
// import UploadImage from './components/UploadImage';
// import LoginForm from "./components/LoginForm";
// import SignupForm from './components/SignupForm';
// import AdminDashboard from "./components/admin/AdminDashboard";
// import WorkerDashboard from "./components/worker/WorkerDashboard";
// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-white flex flex-col">
//         <Navigation />
//         <main className="flex-grow">
//           <Routes>
//             {/* Route for the home page */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<LoginForm />} />
//             <Route path="/signup" element={<SignupForm />} />
//             {/* Route for the report issue page */}
//             <Route path="/report-issue" element={<UploadImage />} />
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/worker" element={<WorkerDashboard />} />

//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Cleaned Up Imports (one for each component) ---
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./components/Homepage";
import UploadImage from './components/UploadImage';
import LoginForm from "./components/LoginForm";
import SignupForm from './components/SignupForm';
import AdminDashboard from "./components/admin/AdminDashboard";
import WorkerDashboard from "./components/worker/WorkerDashboard";
import CitizenDashboard from "./components/citizen/CitizenDashboard";
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
               <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/worker" element={<WorkerDashboard />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;