-- Garante que a coluna metadata exista na tabela visitors
ALTER TABLE public.visitors 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Atualiza a função create_visitors_table para incluir a coluna metadata
CREATE OR REPLACE FUNCTION create_visitors_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Cria a tabela se não existir
    CREATE TABLE IF NOT EXISTS public.visitors (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        visit_count INTEGER DEFAULT 0,
        is_new_visitor BOOLEAN DEFAULT true,
        distance DOUBLE PRECISION NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Cria a função update_updated_at_column se não existir
    CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = timezone('utc'::text, now());
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Cria o trigger se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_visitors_updated_at'
    ) THEN
        CREATE TRIGGER update_visitors_updated_at
            BEFORE UPDATE ON public.visitors
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;

    -- Concede permissões
    GRANT ALL ON public.visitors TO authenticated;
    GRANT ALL ON public.visitors TO service_role;
END;
$$;
