"use client"

import { useState } from "react"
import { Mail, ArrowRight } from "lucide-react"

const CallToAction = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
    alert("Thank you for subscribing to our newsletter!")
  }

  return (
    <section className="py-20 bg-gradient-to-r from-green-500 to-green-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Make a Difference?</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Join thousands of community members who are already creating cleaner, healthier neighborhoods. Start
              reporting today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3 flex items-center justify-center gap-2">
              Start Reporting Now
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="btn border-2 border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
              Learn More
            </button>
          </div>

          <div className="pt-8 border-t border-green-400">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Stay Updated</span>
              </div>
              <p className="text-green-100">
                Get the latest updates on community cleanups and environmental initiatives
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="btn bg-white text-green-600 hover:bg-gray-100 px-6 py-3 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction




