import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex flex-wrap justify-between items-center px-4 py-4 bg-gray-800">
        <h1 className="text-2xl font-bold text-green-400">GolfCharity</h1>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-gray-900">
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h2 className="text-5xl font-bold mb-6">Play Golf. Win Prizes. <span className="text-green-400">Change Lives.</span></h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
          Subscribe to our platform, enter your golf scores, participate in monthly prize draws, and support the charity of your choice.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-4 bg-green-500 text-white text-xl rounded-lg hover:bg-green-600 transition">
          Start Your Journey →
        </button>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800 py-16 px-8">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Subscribe', desc: 'Choose monthly or yearly plan' },
            { step: '2', title: 'Enter Scores', desc: 'Add your last 5 golf scores' },
            { step: '3', title: 'Win Prizes', desc: 'Participate in monthly draws' },
            { step: '4', title: 'Give Back', desc: 'Support your chosen charity' },
          ].map((item) => (
            <div key={item.step} className="text-center p-6 bg-gray-700 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-3">{item.step}</div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prize Pool Section */}
      <div className="py-16 px-8">
        <h3 className="text-3xl font-bold text-center mb-12">Prize Pool Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { match: '5 Number Match', pool: '40%', color: 'text-yellow-400', note: 'Jackpot — rolls over!' },
            { match: '4 Number Match', pool: '35%', color: 'text-green-400', note: 'Split among winners' },
            { match: '3 Number Match', pool: '25%', color: 'text-blue-400', note: 'Split among winners' },
          ].map((item) => (
            <div key={item.match} className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
              <div className={`text-5xl font-bold mb-3 ${item.color}`}>{item.pool}</div>
              <h4 className="text-xl font-bold mb-2">{item.match}</h4>
              <p className="text-gray-400">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-8 text-gray-400">
        <p>© 2026 GolfCharity. Making golf meaningful.</p>
      </footer>
    </div>
  );
}

export default Landing;