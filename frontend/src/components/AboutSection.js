import { Users, Target, Heart } from "lucide-react"

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About WasteSpot</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a cleaner world through community-driven waste management. Every report matters, every
            cleanup counts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
            <p className="text-gray-600">
              Powered by citizens who care about their neighborhoods. Together, we create lasting change.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Targeted Solutions</h3>
            <p className="text-gray-600">
              Smart routing and priority systems ensure the most critical issues get addressed first.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Impact</h3>
            <p className="text-gray-600">
              Every cleanup contributes to healthier communities and a more sustainable future.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
