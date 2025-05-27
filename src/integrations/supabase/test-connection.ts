import { supabase } from './client';

async function testConnection() {
  try {
    // Testa a conexão fazendo uma consulta simples
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erro ao conectar com o Supabase:', error.message);
      return false;
    }

    console.log('Conexão com o Supabase estabelecida com sucesso!');
    console.log('Dados recebidos:', data);
    return true;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return false;
  }
}

// Executa o teste
testConnection(); 