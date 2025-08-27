

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./components/Homepage";
import UploadImage from './components/UploadImage'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            {/* Route for the home page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Route for the report issue page */}
            <Route path="/report-issue" element={<UploadImage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;