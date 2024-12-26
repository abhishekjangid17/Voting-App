import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCandidates, voteForCandidate } from '../services/api';
import { Candidate } from '../types';
import { LogOut, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to load candidates:', error);
    }
  };

  const handleVote = async (candidateId: string) => {
    try {
      await voteForCandidate(candidateId);
      setUser(user ? { ...user, hasVoted: true } : null);
      loadCandidates();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Voting System</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.aadharNumber}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Available Candidates</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{candidate.party}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Votes: {candidate.voteCount}
                  </p>
                  {!user?.hasVoted && !user?.isAdmin && (
                    <button
                      onClick={() => handleVote(candidate._id)}
                      className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Vote
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}