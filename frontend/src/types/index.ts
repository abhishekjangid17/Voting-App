export interface User {
  _id: string;
  aadharNumber: string;
  isAdmin: boolean;
  hasVoted: boolean;
}

export interface Candidate {
  _id: string;
  name: string;
  party: string;
  voteCount: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}