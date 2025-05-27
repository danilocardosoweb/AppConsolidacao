-- Drop existing table and function
DROP TABLE IF EXISTS public.visitors;
DROP FUNCTION IF EXISTS create_visitors_table();

-- Create visitors table with correct structure
CREATE TABLE public.visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    visit_count INTEGER DEFAULT 0,
    is_new_visitor BOOLEAN DEFAULT true,
    distance DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_visitors_updated_at
    BEFORE UPDATE ON public.visitors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant access
GRANT ALL ON public.visitors TO authenticated;
GRANT ALL ON public.visitors TO service_role;

-- Create function to create visitors table
CREATE OR REPLACE FUNCTION create_visitors_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.visitors (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        visit_count INTEGER DEFAULT 0,
        is_new_visitor BOOLEAN DEFAULT true,
        distance DOUBLE PRECISION NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create updated_at trigger
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = timezone('utc'::text, now());
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_visitors_updated_at ON public.visitors;
    CREATE TRIGGER update_visitors_updated_at
        BEFORE UPDATE ON public.visitors
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    -- Grant access
    GRANT ALL ON public.visitors TO authenticated;
    GRANT ALL ON public.visitors TO service_role;
END;
$$; 