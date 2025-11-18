-- Add refund_credit function for failed generations
CREATE OR REPLACE FUNCTION refund_credit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add 1 credit back and decrement total_credits_used
  UPDATE user_credits
  SET 
    credits_remaining = credits_remaining + 1,
    total_credits_used = GREATEST(0, total_credits_used - 1),
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Return true if update was successful
  RETURN FOUND;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION refund_credit(uuid) TO authenticated;
