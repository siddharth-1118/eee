-- ====================================================================
-- SRM EEE Academic Session Communication Portal - Supabase SQL Schema
-- ====================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create Enrolled Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    reg_no TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    batch TEXT NOT NULL,
    year TEXT DEFAULT 'Final Year UG',
    capstone_group TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Academic Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    cohort TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    time_display TEXT,
    duration TEXT,
    platform TEXT DEFAULT 'meet',
    platform_name TEXT DEFAULT 'Google Meet',
    link TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'upcoming',
    recipient_group TEXT DEFAULT 'both',
    recipient_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Email Dispatches Log Table
CREATE TABLE IF NOT EXISTS public.email_dispatches (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.sessions(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    sender_email TEXT DEFAULT 'srmeeelibraray@gmail.com',
    recipient_count INTEGER NOT NULL,
    delivered_count INTEGER NOT NULL,
    failed_count INTEGER DEFAULT 0,
    recipients_json JSONB,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_dispatches ENABLE ROW LEVEL SECURITY;

-- 5. Open Read/Write Policies for Authorized Portal Users
CREATE POLICY "Allow authenticated & anon read for portal" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated & anon insert for portal" ON public.students
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for sessions" ON public.sessions
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for email_dispatches" ON public.email_dispatches
    FOR ALL USING (true);

-- 6. Preload SRM EEE Students Sample Roster
INSERT INTO public.students (id, name, reg_no, email, batch, year, capstone_group)
VALUES 
  ('STU-001', 'Arun Kumar', 'RA2111005010012', 'arunkumar.srmeee@gmail.com', 'EEE-A', 'Final Year UG', 'Group 04'),
  ('STU-002', 'Priya Venkatesh', 'RA2111005010018', 'priyavenkat.srmeee@gmail.com', 'EEE-A', 'Final Year UG', 'Group 04'),
  ('STU-003', 'Rahul Sharma', 'RA2111005010025', 'rahulsharma.srmeee@gmail.com', 'EEE-A', 'Final Year UG', 'Group 04'),
  ('STU-004', 'Kavya Sundaram', 'RA2111005010034', 'kavyasundaram.srmeee@gmail.com', 'EEE-A', 'Final Year UG', 'Group 09'),
  ('STU-005', 'Aditya Nair', 'RA2111005010041', 'adityanair.srmeee@gmail.com', 'EEE-A', 'Final Year UG', 'Group 09'),
  ('STU-006', 'Sneha Ranganathan', 'RA2111005010055', 'sneharangan.srmeee@gmail.com', 'EEE-B', 'Final Year UG', 'Group 09'),
  ('STU-007', 'Deepak Raj', 'RA2111005010062', 'deepakraj.srmeee@gmail.com', 'EEE-B', 'Final Year UG', 'Group 12'),
  ('STU-008', 'Divya Menon', 'RA2111005010070', 'divyamenon.srmeee@gmail.com', 'EEE-B', 'Final Year UG', 'Group 12'),
  ('STU-009', 'Karthik Subramanian', 'RA2111005010083', 'karthiksubramanian.srmeee@gmail.com', 'EEE-B', 'Final Year UG', 'Group 12'),
  ('STU-010', 'Ananya Deshmukh', 'RA2111005010095', 'ananyadeshmukh.srmeee@gmail.com', 'EEE-B', 'Final Year UG', 'Group 12')
ON CONFLICT (reg_no) DO NOTHING;
