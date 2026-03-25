import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newCharity, setNewCharity] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    checkAdmin();
    fetchAll();
  }, []);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    if (!profile?.is_admin) {
      alert('Access denied. Admins only.');
      navigate('/dashboard');
      return;
    }
  };

  const fetchAll = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: scores } = await supabase.from('scores').select('*');
    const { data: charities } = await supabase.from('charities').select('*');
    const { data: winners } = await supabase.from('winners').select('*');
    const { data: draws } = await supabase.from('draws').select('*');
    setUsers(profiles || []);
    setScores(scores || []);
    setCharities(charities || []);
    setWinners(winners || []);
    setDraws(draws || []);
    setLoading(false);
  };

  const runDraw = async () => {
    const winningNumbers = [];
while (winningNumbers.length < 5) {
  const num = Math.floor(Math.random() * 45) + 1;
  if (!winningNumbers.includes(num)) {
    winningNumbers.push(num);
  }
}
    
    const { data: draw, error } = await supabase
      .from('draws')
      .insert([
        {
          draw_date: new Date().toISOString().split('T')[0],
          winning_numbers: winningNumbers,
          status: 'published',
          jackpot_amount:
            users.filter((u) => u.subscription_status === 'active').length *
            400,
        },
      ])
      .select()
      .single();
    if (error) {
      setMessage('Error running draw');
      return;
    }
    const { data: allScores, error: scoreError } = await supabase
  .from('scores')
  .select('*');

if (scoreError) {
  setMessage('Error fetching scores');
  return;
}
    const userScoreMap = {};
    allScores?.forEach((s) => {
      if (!userScoreMap[s.user_id]) userScoreMap[s.user_id] = [];
      userScoreMap[s.user_id].push(s.score);
    });
    // STEP 1: Collect winners first
const winnersList = [];

for (const [userId, userScores] of Object.entries(userScoreMap)) {
  const uniqueUserScores = [...new Set(userScores)];
  const uniqueDrawNumbers = [...new Set(winningNumbers)];

  const matches = uniqueUserScores.filter((s) =>
    uniqueDrawNumbers.includes(s)
  ).length;

  let matchType = null;

  if (matches === 5) matchType = '5-match';
  else if (matches === 4) matchType = '4-match';
  else if (matches === 3) matchType = '3-match';

  if (matchType) {
    winnersList.push({
      user_id: userId,
      match_type: matchType,
    });
  }
}

// STEP 2: Calculate prize split
const fiveMatchWinners = winnersList.filter(w => w.match_type === '5-match');
const fourMatchWinners = winnersList.filter(w => w.match_type === '4-match');
const threeMatchWinners = winnersList.filter(w => w.match_type === '3-match');

const fivePrize = fiveMatchWinners.length
  ? (draw.jackpot_amount * 0.4) / fiveMatchWinners.length
  : 0;

const fourPrize = fourMatchWinners.length
  ? (draw.jackpot_amount * 0.35) / fourMatchWinners.length
  : 0;

const threePrize = threeMatchWinners.length
  ? (draw.jackpot_amount * 0.25) / threeMatchWinners.length
  : 0;

// STEP 3: Insert winners with correct prize
for (const winner of winnersList) {
  let prizeAmount = 0;

  if (winner.match_type === '5-match') prizeAmount = fivePrize;
  if (winner.match_type === '4-match') prizeAmount = fourPrize;
  if (winner.match_type === '3-match') prizeAmount = threePrize;

  await supabase.from('winners').insert([
    {
      draw_id: draw.id,
      user_id: winner.user_id,
      match_type: winner.match_type,
      prize_amount: prizeAmount,
      payment_status: 'pending',
      verification_status: 'pending',
    },
  ]);
}
    setMessage(
      `Draw completed! Winning numbers: ${winningNumbers.join(', ')}`,
    );
    fetchAll();
  };

  const addCharity = async () => {
    if (!newCharity.name) {
      setMessage('Charity name is required');
      return;
    }
    const { error } = await supabase
      .from('charities')
      .insert([newCharity]);
    if (error) {
      setMessage('Error adding charity');
      return;
    }
    setMessage('Charity added!');
    setNewCharity({ name: '', description: '', image_url: '' });
    fetchAll();
  };

  const deleteCharity = async (id) => {
    await supabase.from('charities').delete().eq('id', id);
    setMessage('Charity deleted');
    fetchAll();
  };

  const updatePayment = async (winnerId) => {
    await supabase
      .from('winners')
      .update({ payment_status: 'paid' })
      .eq('id', winnerId);
    setMessage('Payment marked as paid');
    fetchAll();
  };

  const updateVerification = async (winnerId, status) => {
    await supabase
      .from('winners')
      .update({
        verification_status: status,
        verified_at: new Date().toISOString(),
      })
      .eq('id', winnerId);
    setMessage(`Winner ${status} successfully`);
    fetchAll();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading Admin Panel...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-red-900 border-b border-red-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>🔧</span>
            <span>Admin Panel</span>
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="self-start sm:self-auto px-3 sm:px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 text-xs sm:text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className="bg-green-500 text-white text-center py-2 text-sm px-4">
          {message}
          <button
            onClick={() => setMessage('')}
            className="ml-4 underline text-xs"
          >
            dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length },
          {
            label: 'Active Subscribers',
            value: users.filter(
              (u) => u.subscription_status === 'active',
            ).length,
          },
          { label: 'Total Draws', value: draws.length },
          { label: 'Total Winners', value: winners.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800 p-4 rounded-lg text-center"
          >
            <p className="text-2xl sm:text-3xl font-bold text-red-400">
              {stat.value}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            {['users', 'draw', 'charities', 'winners'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 capitalize font-medium border-b-2 text-xs sm:text-sm transition ${
                  activeTab === tab
                    ? 'border-red-400 text-red-400'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              All Users ({users.length})
            </h3>
            <div className="bg-gray-800 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Plan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-gray-700"
                    >
                      <td className="px-4 py-3 text-gray-300 text-xs sm:text-sm">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs sm:text-sm">
                        {u.full_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            u.subscription_status === 'active'
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {u.subscription_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs sm:text-sm">
                        {u.subscription_plan || 'none'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DRAW TAB */}
        {activeTab === 'draw' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Draw Management</h3>
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-red-400 mb-2">
                Run Monthly Draw
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Generates 5 random winning numbers and checks all user
                scores for matches.
              </p>
              <button
                onClick={runDraw}
                className="px-8 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600"
              >
                🎲 Run Draw Now
              </button>
            </div>
            <h4 className="font-bold mb-3">Previous Draws</h4>
            <div className="bg-gray-800 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Winning Numbers
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Jackpot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {draws.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No draws yet
                      </td>
                    </tr>
                  ) : (
                    draws.map((d) => (
                      <tr
                        key={d.id}
                        className="border-t border-gray-700"
                      >
                        <td className="px-4 py-3 text-gray-300 text-xs sm:text-sm">
                          {d.draw_date}
                        </td>
                        <td className="px-4 py-3 text-yellow-400 font-bold text-xs sm:text-sm">
                          {d.winning_numbers?.join(', ')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-500 rounded text-xs font-bold">
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs sm:text-sm">
                          ₹{d.jackpot_amount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CHARITIES TAB */}
        {activeTab === 'charities' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Manage Charities</h3>
            <div className="bg-gray-800 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-red-400 mb-4">
                Add New Charity
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Charity Name"
                  value={newCharity.name}
                  onChange={(e) =>
                    setNewCharity({
                      ...newCharity,
                      name: e.target.value,
                    })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newCharity.description}
                  onChange={(e) =>
                    setNewCharity({
                      ...newCharity,
                      description: e.target.value,
                    })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCharity.image_url}
                  onChange={(e) =>
                    setNewCharity({
                      ...newCharity,
                      image_url: e.target.value,
                    })
                  }
                  className="px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={addCharity}
                  className="px-6 py-2 bg-red-500 rounded font-bold hover:bg-red-600 w-fit"
                >
                  Add Charity
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {charities.map((c) => (
                <div key={c.id} className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">{c.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    {c.description}
                  </p>
                  <button
                    onClick={() => deleteCharity(c.id)}
                    className="px-4 py-2 bg-red-600 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WINNERS TAB */}
        {activeTab === 'winners' && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              Winners &amp; Verification
            </h3>
            <div className="bg-gray-800 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Match
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Prize
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Proof
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Verification
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {winners.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No winners yet. Run a draw first.
                      </td>
                    </tr>
                  ) : (
                    winners.map((w) => (
                      <tr
                        key={w.id}
                        className="border-t border-gray-700"
                      >
                        <td className="px-4 py-3 text-gray-300 text-xs sm:text-sm">
                          {w.user_id?.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-yellow-400 font-bold text-xs sm:text-sm">
                          {w.match_type}
                        </td>
                        <td className="px-4 py-3 text-green-400 text-xs sm:text-sm">
                          ₹{w.prize_amount}
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs max-w-xs truncate">
                          {w.proof_url || 'No proof yet'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              w.verification_status === 'approved'
                                ? 'bg-green-500'
                                : w.verification_status === 'rejected'
                                ? 'bg-red-500'
                                : w.verification_status === 'submitted'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-500'
                            }`}
                          >
                            {w.verification_status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              w.payment_status === 'paid'
                                ? 'bg-green-500'
                                : 'bg-yellow-500 text-black'
                            }`}
                          >
                            {w.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {w.verification_status === 'submitted' && (
                              <>
                                <button
                                  onClick={() =>
                                    updateVerification(
                                      w.id,
                                      'approved',
                                    )
                                  }
                                  className="px-2 py-1 bg-green-500 rounded text-xs hover:bg-green-600"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    updateVerification(
                                      w.id,
                                      'rejected',
                                    )
                                  }
                                  className="px-2 py-1 bg-red-500 rounded text-xs hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {w.payment_status !== 'paid' &&
                              w.verification_status === 'approved' && (
                                <button
                                  onClick={() =>
                                    updatePayment(w.id)
                                  }
                                  className="px-2 py-1 bg-blue-500 rounded text-xs hover:bg-blue-600"
                                >
                                  Mark Paid
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
