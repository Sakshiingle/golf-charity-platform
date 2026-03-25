import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function WinningsTab({ userId }) {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWinnings();
  }, [userId]);

  const fetchWinnings = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*, draws(draw_date, winning_numbers)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setWinners(data || []);
    setLoading(false);
  };

  const handleProofUpload = async (winnerId, proofText) => {
    if (!proofText) return;

    setUploading(true);
    const { error } = await supabase
      .from('winners')
      .update({
        proof_url: proofText,
        verification_status: 'submitted',
      })
      .eq('id', winnerId);

    if (error) {
      setMessage('Error submitting proof');
    } else {
      setMessage('Proof submitted! Admin will review.');
    }

    setUploading(false);
    fetchWinnings();
  };

  if (loading) {
    return <p className="text-slate-400">Loading winnings...</p>;
  }

  return (
    <div>
      {message && (
        <div className="bg-emerald-500 text-white p-3 rounded mb-4 text-sm flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={() => setMessage('')}
            className="ml-4 underline text-xs"
          >
            dismiss
          </button>
        </div>
      )}

      {winners.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center">
          <p className="text-4xl mb-4">🏆</p>
          <p className="text-slate-400">
            No winnings yet. Participate in draws to win!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Total Won</p>
              <p className="text-2xl font-bold text-emerald-400">
                ₹
                {winners.reduce(
                  (sum, w) => sum + (w.prize_amount || 0),
                  0
                )}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Times Won</p>
              <p className="text-2xl font-bold text-emerald-400">
                {winners.length}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-400 text-sm">Paid Out</p>
              <p className="text-2xl font-bold text-emerald-400">
                ₹
                {winners
                  .filter((w) => w.payment_status === 'paid')
                  .reduce(
                    (sum, w) => sum + (w.prize_amount || 0),
                    0
                  )}
              </p>
            </div>
          </div>

          {/* Winners list */}
          {winners.map((w) => (
            <div
              key={w.id}
              className="bg-slate-800 p-6 rounded-lg border border-slate-700"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <p className="text-amber-400 font-bold text-lg">
                    {w.match_type}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Draw: {w.draws?.draw_date}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Winning Numbers:{' '}
                    {w.draws?.winning_numbers?.join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-2xl font-bold">
                    ₹{w.prize_amount}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${
                      w.payment_status === 'paid'
                        ? 'bg-emerald-500'
                        : 'bg-amber-400 text-black'
                    }`}
                  >
                    {w.payment_status}
                  </span>
                </div>
              </div>

              {/* Verification section */}
              <div className="mt-4 border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400 mb-2">
                  Verification Status:
                  <span
                    className={`ml-2 font-bold ${
                      w.verification_status === 'approved'
                        ? 'text-emerald-400'
                        : w.verification_status === 'rejected'
                        ? 'text-rose-400'
                        : w.verification_status === 'submitted'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {w.verification_status?.toUpperCase() || 'PENDING'}
                  </span>
                </p>

                {w.verification_status === 'pending' && (
                  <ProofUpload
                    winnerId={w.id}
                    onSubmit={handleProofUpload}
                    uploading={uploading}
                  />
                )}

                {w.verification_status === 'submitted' && (
                  <p className="text-amber-400 text-sm">
                    ⏳ Proof submitted. Waiting for admin review.
                  </p>
                )}

                {w.verification_status === 'approved' && (
                  <p className="text-emerald-400 text-sm">
                    ✅ Verified and approved by admin.
                  </p>
                )}

                {w.verification_status === 'rejected' && (
                  <div>
                    <p className="text-rose-400 text-sm">
                      ❌ Proof rejected. Please resubmit.
                    </p>
                    <ProofUpload
                      winnerId={w.id}
                      onSubmit={handleProofUpload}
                      uploading={uploading}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProofUpload({ winnerId, onSubmit, uploading }) {
  const [proofText, setProofText] = useState('');

  return (
    <div className="mt-2">
      <p className="text-slate-400 text-sm mb-2">
        Submit your golf platform screenshot URL as proof:
      </p>
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={proofText}
          onChange={(e) => setProofText(e.target.value)}
          placeholder="Paste screenshot URL or description"
          className="flex-1 px-3 py-2 bg-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => onSubmit(winnerId, proofText)}
          disabled={uploading || !proofText}
          className="px-4 py-2 bg-emerald-500 rounded text-sm font-bold hover:bg-emerald-600 disabled:opacity-50"
        >
          {uploading ? 'Submitting...' : 'Submit Proof'}
        </button>
      </div>
    </div>
  );
}

export default WinningsTab;
