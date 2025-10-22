import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  wallet_address: string;
  reputation_points: number;
  earnings: number;
  is_admin: boolean;
  created_at: string;
};

export type Story = {
  id: string;
  title: string;
  link: string;
  submitted_by: string;
  submission_fee: number;
  created_at: string;
  voting_ends_at: string;
  status: 'voting' | 'tallied' | 'distributed';
  final_result: 'true' | 'false' | null;
  votes_true: number;
  votes_false: number;
  total_votes: number;
};

export type Vote = {
  id: string;
  story_id: string;
  user_id: string;
  vote: boolean;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  story_id: string | null;
  amount: number;
  type: 'submission_fee' | 'vote_reward' | 'admin_fee';
  created_at: string;
};
