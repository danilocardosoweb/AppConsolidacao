-- Adiciona a coluna metadata à tabela visitors se não existir
ALTER TABLE public.visitors 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Atualiza a função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria o trigger se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_visitors_updated_at'
    ) THEN
        CREATE TRIGGER update_visitors_updated_at
            BEFORE UPDATE ON public.visitors
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

-- Concede permissões
GRANT ALL ON public.visitors TO authenticated;
GRANT ALL ON public.visitors TO service_role;
