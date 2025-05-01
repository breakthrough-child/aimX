-- 20240415_create_webhook_logs.sql
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  status TEXT NOT NULL,
  signature_valid BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE swap_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_id UUID NOT NULL REFERENCES swaps(id),
  tx_hash TEXT,
  status TEXT NOT NULL,
  response JSONB,
  created_at TIMESTAMP DEFAULT now()
);

