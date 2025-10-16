import { TrendingUp, Award, Globe } from "lucide-react"

const CommunityImpact = () => {
  const impacts = [
    {
      icon: TrendingUp,
      number: "5,000+",
      label: "Waste Reports Resolved",
      description: "Community issues successfully addressed",
    },
    {
      icon: Award,
      number: "50+",
      label: "Communities Served",
      description: "Cities and neighborhoods using our platform",
    },
    {
      icon: Globe,
      number: "98%",
      label: "Success Rate",
      description: "Reports that lead to successful cleanup",
    },
  ]

  return (
    <section  id="community" className="py-20 bg-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Community Impact</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Together, we're making a real difference in communities worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {impacts.map((impact, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <impact.icon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{impact.number}</div>
              <div className="text-xl font-semibold text-white mb-2">{impact.label}</div>
              <div className="text-green-100">{impact.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunityImpact
