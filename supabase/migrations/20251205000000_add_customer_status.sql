-- Add status column to customers table
-- Status: 'pending' (default), 'approved', 'member'

ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Add constraint to validate status values
ALTER TABLE public.customers 
ADD CONSTRAINT customers_status_check 
CHECK (status IN ('pending', 'approved', 'member'));

-- Update existing customers to have 'pending' status if null
UPDATE public.customers SET status = 'pending' WHERE status IS NULL;

-- Create index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
