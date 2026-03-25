import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import WinningsTab from '../components/WinningsTab';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [scores, setScores] = useState([]);
  const [charities, setCharities] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUser();
    getCharities();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(profile);
    const { data: scores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5);
    setScores(scores || []);
    setLoading(false);
  };

  const getCharities = async () => {
    const { data } = await supabase.from('charities').select('*');
    setCharities(data || []);
  };

  const handleAddScore = async () => {
    // 🔥 SUBSCRIPTION VALIDATION (ADDED)
    if (profile?.subscription_status !== 'active') {
      setMessage('Please subscribe before adding scores');
      return;
    }
  
    if (!newScore || !newDate) {
      setMessage('Please enter score and date');
      return;
    }
  
    if (newScore < 1 || newScore > 45) {
      setMessage('Score must be between 1 and 45');
      return;
    }
  
    const { data: existingScores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: true });
  
    if (existingScores && existingScores.length >= 5) {
      await supabase.from('scores').delete().eq('id', existingScores[0].id);
    }
  
    const { error } = await supabase.from('scores').insert([
      {
        user_id: user.id,
        score: parseInt(newScore),
        score_date: newDate,
      },
    ]);
  
    if (error) {
      setMessage('Error adding score');
      return;
    }
  
    setMessage('Score added successfully!');
    setNewScore('');
    setNewDate('');
    getUser();
  };

  const handleSelectCharity = async (charityId) => {
    await supabase
      .from('profiles')
      .update({ charity_id: charityId })
      .eq('id', user.id);
    setMessage('Charity updated!');
    getUser();
  };

  const handleSubscribe = async (plan) => {
    await supabase
      .from('profiles')
      .update({ subscription_status: 'active', subscription_plan: plan })
      .eq('id', user.id);
    setMessage(`Subscribed to ${plan} plan!`);
    getUser();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 px-2 sm:px-4 py-4 flex justify-between items-center">
  <h1 className="text-lg sm:text-xl font-bold text-green-400">
    GolfCharity
  </h1>
  <div className="flex items-center gap-4 ml-auto">
          <span className="text-gray-300 text-xs sm:text-sm hidden md:block">
            {profile?.email}
          </span>
          {profile?.is_admin && (
            <button
            onClick={() => navigate('/admin')}
            className="px-3 sm:px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-xs sm:text-sm font-bold ml-8 sm:ml-12"
          >
          Admin Panel
          </button>
          
          )}
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-2 bg-red-500 rounded hover:bg-red-600 text-xs sm:text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Message */}
      {message && (
        <div className="bg-green-500 text-white text-center py-2 text-sm">
          {message}
          <button
            onClick={() => setMessage('')}
            className="ml-4 underline text-xs"
          >
            dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-700 px-4 sm:px-6 mt-4">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
          {['overview', 'scores', 'charity', 'subscription', 'winnings'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 capitalize font-medium border-b-2 text-xs sm:text-sm transition ${
                  activeTab === tab
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400 text-sm">Subscription Status</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  profile?.subscription_status === 'active'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {profile?.subscription_status?.toUpperCase() || 'INACTIVE'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {profile?.subscription_plan || 'No plan'}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400 text-sm">Scores Entered</p>
              <p className="text-2xl font-bold mt-1 text-green-400">
                {scores.length} / 5
              </p>
              <p className="text-gray-500 text-sm mt-1">Last 5 scores kept</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400 text-sm">Charity Contribution</p>
              <p className="text-2xl font-bold mt-1 text-green-400">
                {profile?.charity_percentage || 10}%
              </p>
              <p className="text-gray-500 text-sm mt-1">
                of subscription fee
              </p>
            </div>
          </div>
        )}

        {/* SCORES TAB */}
        {activeTab === 'scores' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Golf Scores</h3>
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h4 className="font-bold mb-4 text-green-400">Add New Score</h4>
              <div className="flex gap-4 flex-wrap">
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="Score (1-45)"
                  className="px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
  onClick={handleAddScore}
  disabled={profile?.subscription_status !== 'active'}
  className={`px-6 py-2 rounded font-bold ${
    profile?.subscription_status === 'active'
      ? 'bg-green-500 hover:bg-green-600'
      : 'bg-gray-500 cursor-not-allowed'
  }`}
>
  Add Score
</button>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Only last 5 scores are kept. Oldest is removed automatically.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[320px]">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300">#</th>
                    <th className="px-6 py-3 text-left text-gray-300">Score</th>
                    <th className="px-6 py-3 text-left text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        No scores yet. Add your first score!
                      </td>
                    </tr>
                  ) : (
                    scores.map((s, i) => (
                      <tr
                        key={s.id}
                        className="border-t border-gray-700"
                      >
                        <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                        <td className="px-6 py-4 text-green-400 font-bold">
                          {s.score}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {s.score_date}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CHARITY TAB */}
        {activeTab === 'charity' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Select Your Charity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  className={`bg-gray-800 p-6 rounded-lg border-2 cursor-pointer transition ${
                    profile?.charity_id === charity.id
                      ? 'border-green-400'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => handleSelectCharity(charity.id)}
                >
                  {charity.image_url && (
                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <h4 className="font-bold text-white mb-2">
                    {charity.name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {charity.description}
                  </p>
                  {profile?.charity_id === charity.id && (
                    <p className="text-green-400 text-sm font-bold mt-3">
                      ✓ Selected
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Subscription Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <h4 className="text-2xl font-bold mb-2">Monthly</h4>
                <p className="text-4xl font-bold text-green-400 mb-4">
                  ₹999
                  <span className="text-lg text-gray-400">/mo</span>
                </p>
                <ul className="text-gray-300 mb-6 space-y-2">
                  <li>✓ Enter golf scores</li>
                  <li>✓ Monthly draw entry</li>
                  <li>✓ Charity contribution</li>
                </ul>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600"
                >
                  {profile?.subscription_plan === 'monthly'
                    ? '✓ Current Plan'
                    : 'Subscribe Monthly'}
                </button>
              </div>
              <div className="bg-gray-800 p-8 rounded-lg border border-green-400">
                <div className="text-green-400 text-sm font-bold mb-2">
                  BEST VALUE
                </div>
                <h4 className="text-2xl font-bold mb-2">Yearly</h4>
                <p className="text-4xl font-bold text-green-400 mb-4">
                  ₹8999
                  <span className="text-lg text-gray-400">/yr</span>
                </p>
                <ul className="text-gray-300 mb-6 space-y-2">
                  <li>✓ Everything in Monthly</li>
                  <li>✓ 2 months free</li>
                  <li>✓ Priority support</li>
                </ul>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  className="w-full py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600"
                >
                  {profile?.subscription_plan === 'yearly'
                    ? '✓ Current Plan'
                    : 'Subscribe Yearly'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WINNINGS TAB */}
        {activeTab === 'winnings' && (
          <div>
            <h3 className="text-xl font-bold mb-6">My Winnings</h3>
            <WinningsTab userId={user?.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
