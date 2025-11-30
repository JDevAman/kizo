import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    content: "KinzokuPay has revolutionized how I receive payments.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Small Business Owner",
    content: "The instant transfers have improved my cash flow.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Digital Nomad",
    content: "Sending money while traveling has been a game-changer.",
    rating: 5,
  },
]

export const TestimonialsSection = () => (
  <section id="testimonials" className="py-20 px-4 bg-slate-900/20">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-thin text-white mb-4">Trusted by Millions</h2>
        <p className="text-xl text-slate-400">See what our users have to say about KinzokuPay</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">"{t.content}"</p>
            <div>
              <p className="text-white font-medium">{t.name}</p>
              <p className="text-slate-400 text-sm">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)