// import { Users, Target, Heart } from "lucide-react"

// const AboutSection = () => {
//   return (
//     <section id="about" className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About CityZen</h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             We're building a cleaner world through community-driven waste management. Every report matters, every
//             cleanup counts.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="card text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Users className="h-8 w-8 text-green-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
//             <p className="text-gray-600">
//               Powered by citizens who care about their neighborhoods. Together, we create lasting change.
//             </p>
//           </div>

//           <div className="card text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Target className="h-8 w-8 text-green-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Targeted Solutions</h3>
//             <p className="text-gray-600">
//               Smart routing and priority systems ensure the most critical issues get addressed first.
//             </p>
//           </div>

//           <div className="card text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Heart className="h-8 w-8 text-green-500" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Impact</h3>
//             <p className="text-gray-600">
//               Every cleanup contributes to healthier communities and a more sustainable future.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default AboutSection



import { Users, Target, Heart } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            About CityZen
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            We're building a cleaner world through community-driven waste management.
            Every report matters, every cleanup counts.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md p-6 sm:p-7 md:p-8 border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 break-words leading-snug">
              Community Driven
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Powered by citizens who care about their neighborhoods. Together,
              we create lasting change.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md p-6 sm:p-7 md:p-8 border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <Target className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 break-words leading-snug">
              Targeted Solutions
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Smart routing and priority systems ensure the most critical
              issues get addressed first.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md p-6 sm:p-7 md:p-8 border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 break-words leading-snug">
              Environmental Impact
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Every cleanup contributes to healthier communities and a
              more sustainable future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
