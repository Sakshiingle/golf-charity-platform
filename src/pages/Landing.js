import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center px-4 py-4 bg-gray-800">
        <h1 className="text-2xl font-bold text-green-400">ImpactPlay</h1>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-900">
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
            Subscribe
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Turn Your Game Into <span className="text-green-400">Real Impact</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
          Every score you enter isn’t just a number. It’s a chance to win rewards
          and fund meaningful causes. Compete, win, and change lives — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
  <button
    onClick={() => navigate('/signup')}
    className="px-8 py-4 bg-green-500 text-lg rounded-lg hover:bg-green-600 transition">
    Start Subscription →
  </button>
  <button
    onClick={() => navigate('/login')}
    className="px-8 py-4 border border-white rounded-lg hover:bg-white hover:text-gray-900">
    Already a Member
  </button>
</div>

{/* Trust Stats */}
<div className="flex flex-wrap justify-center gap-8 mt-12">
  {[
    { value: '₹50,000+', label: 'Donated to Charities' },
    { value: '200+', label: 'Active Members' },
    { value: '12', label: 'Monthly Draws' },
    { value: '₹2,00,000+', label: 'Prize Pool Distributed' },
  ].map((stat) => (
    <div key={stat.label} className="text-center">
      <p className="text-3xl font-bold text-green-400">{stat.value}</p>
      <p className="text-gray-400 text-sm">{stat.label}</p>
    </div>
  ))}
</div>
      </section>

      {/* Charity Spotlight */}
      <section className="bg-gray-800 py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">
          Make Every Game Count ❤️
        </h3>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Education for All",
              desc: "Help provide education resources to underprivileged children."
            },
            {
              title: "Healthcare Access",
              desc: "Support life-saving treatments for those who can't afford it."
            },
            {
              title: "Clean Water Initiative",
              desc: "Fund clean water projects in rural communities."
            }
          ].map((charity, i) => (
            <div key={i} className="p-6 bg-gray-700 rounded-lg hover:scale-105 transition">
              <h4 className="text-xl font-bold mb-2 text-green-400">{charity.title}</h4>
              <p className="text-gray-300">{charity.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { step: "1", title: "Subscribe", desc: "Join monthly or yearly plan" },
            { step: "2", title: "Enter Scores", desc: "Add your last 5 scores" },
            { step: "3", title: "Draw Happens", desc: "Monthly random draw runs" },
            { step: "4", title: "Win + Give", desc: "Win rewards & support charity" },
          ].map((item) => (
            <div key={item.step} className="p-6 bg-gray-800 rounded-lg text-center">
              <div className="text-4xl font-bold text-green-400 mb-3">
                {item.step}
              </div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Draw Explanation */}
      <section className="bg-gray-800 py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">
          Monthly Draw System 🎯
        </h3>

        <div className="max-w-4xl mx-auto text-center text-gray-300">
          <p className="mb-6">
            Each month, a draw generates 5 random numbers. If your scores match:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-700 rounded-lg">
              <h4 className="text-yellow-400 text-xl font-bold mb-2">5 Matches</h4>
              <p>Jackpot Winner (Rolls over if no winner)</p>
            </div>

            <div className="p-6 bg-gray-700 rounded-lg">
              <h4 className="text-green-400 text-xl font-bold mb-2">4 Matches</h4>
              <p>Shared Prize Pool</p>
            </div>

            <div className="p-6 bg-gray-700 rounded-lg">
              <h4 className="text-blue-400 text-xl font-bold mb-2">3 Matches</h4>
              <p>Small Rewards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Turn Your Scores Into Impact?
        </h3>

        <button
          onClick={() => navigate('/signup')}
          className="px-10 py-4 bg-green-500 text-xl rounded-lg hover:bg-green-600 transition">
          Join Now →
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-6 text-gray-400">
        <p>© 2026 ImpactPlay. Play with purpose.</p>
      </footer>

    </div>
  );
}

export default Landing;