import { Leaf } from "lucide-react"

const Navigation = () => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold text-gray-900">WasteSpot</span>
          </div>
          <div className="md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-green-500 transition-colors">
              About
            </a>
            <a href="#services" className="text-gray-600 hover:text-green-500 transition-colors">
              Services
            </a>
            <a href="#dashboard" className="text-gray-600 hover:text-green-500 transition-colors">
              Dashboard
            </a>
            <a href="#contact" className="text-gray-600 hover:text-green-500 transition-colors">
              Contact
            </a>
          </div>
          <button className="btn btn-primary">Report Waste</button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation;
