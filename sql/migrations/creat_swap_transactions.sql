CREATE TABLE swap_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_id UUID NOT NULL REFERENCES swaps(id),
  tx_hash TEXT,
  status TEXT NOT NULL,
  response JSONB,
  created_at TIMESTAMP DEFAULT now()
);
