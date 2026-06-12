-- Add new fields for researcher hours and employment type refinements
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS teaching_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS research_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_hours INTEGER DEFAULT 0;

-- Optional: If we want to ensure employment_type uses specific values, we could add a check constraint,
-- but for now we'll handle it in the application layer to keep it flexible.
