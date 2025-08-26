import { Star, Quote } from "lucide-react"

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Leader",
      content:
        "WasteSpot has transformed how our neighborhood handles waste management. The response time is incredible!",
      rating: 5,
      avatar: "/professional-woman-smiling.png",
    },
    {
      name: "Mike Chen",
      role: "Local Resident",
      content:
        "I love being able to report issues instantly and see them get resolved. It's made our streets so much cleaner.",
      rating: 5,
      avatar: "/professional-man-smiling.png",
    },
    {
      name: "Emma Davis",
      role: "Environmental Activist",
      content:
        "This platform empowers citizens to take action. The real-time tracking keeps everyone engaged and motivated.",
      rating: 5,
      avatar: "/young-woman-environmental-activist.png",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people making a difference in their neighborhoods
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <Quote className="h-8 w-8 text-green-500 mb-4" />

              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
