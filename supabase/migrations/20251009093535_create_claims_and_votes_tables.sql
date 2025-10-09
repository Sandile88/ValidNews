/*
  # Create ValidNews Claims and Votes Tables


  ## 1. New Tables
  
  ### `claims`
  Stores fact-checking claims submitted by users
  - `id` (uuid, primary key) - Unique identifier for each claim
  - `summary` (text) - Brief description of the claim being fact-checked
  - `ipfs_hash` (text, nullable) - IPFS hash for uploaded article/evidence
  - `wallet_address` (text) - Ethereum wallet address of the submitter
  - `status` (text) - Current status: 'pending', 'verified', or 'false'
  - `true_votes` (integer) - Count of "true" votes
  - `false_votes` (integer) - Count of "false" votes
  - `unsure_votes` (integer) - Count of "unsure" votes
  - `created_at` (timestamptz) - Timestamp when claim was submitted
  - `updated_at` (timestamptz) - Timestamp when claim was last updated

  ### `votes`
  Tracks individual votes cast on claims
  - `id` (uuid, primary key) - Unique identifier for each vote
  - `claim_id` (uuid, foreign key) - References the claim being voted on
  - `wallet_address` (text) - Ethereum wallet address of the voter
  - `vote_type` (text) - Type of vote: 'true', 'false', or 'unsure'
  - `created_at` (timestamptz) - Timestamp when vote was cast

  ## 2. Security
  - Enable RLS on both tables
  - `claims` table:
    - Anyone can read all claims (public browsing)
    - Only authenticated users can insert claims
  - `votes` table:
    - Anyone can read votes for transparency
    - Only authenticated users can insert votes
    - Users can only delete their own votes

  ## 3. Indexes
  - Index on `claims.status` for efficient filtering
  - Index on `votes.claim_id` for efficient vote lookups
  - Unique constraint on votes to prevent duplicate voting

  ## 4. Important Notes
  - Default status for new claims is 'pending'
  - Vote counts default to 0 for new claims
  - Wallet addresses are stored as text for flexibility across chains
  - RLS policies allow public read access for transparency
  - One vote per wallet per claim (enforced by unique constraint)
*/

CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary text NOT NULL,
  ipfs_hash text,
  wallet_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'false')),
  true_votes integer DEFAULT 0 NOT NULL,
  false_votes integer DEFAULT 0 NOT NULL,
  unsure_votes integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('true', 'false', 'unsure')),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(claim_id, wallet_address)
);

CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_claim_id ON votes(claim_id);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view claims"
  ON claims FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create claims"
  ON claims FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE OR REPLACE FUNCTION update_claim_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE claims
  SET 
    true_votes = (SELECT COUNT(*) FROM votes WHERE claim_id = NEW.claim_id AND vote_type = 'true'),
    false_votes = (SELECT COUNT(*) FROM votes WHERE claim_id = NEW.claim_id AND vote_type = 'false'),
    unsure_votes = (SELECT COUNT(*) FROM votes WHERE claim_id = NEW.claim_id AND vote_type = 'unsure'),
    updated_at = now()
  WHERE id = NEW.claim_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_votes_trigger
AFTER INSERT OR DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_claim_votes();