import { supabase } from './client';

async function setupDatabase() {
  try {
    // Verifica se a tabela visitors existe
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('visitors')
      .select('id')
      .limit(1);

    if (tableCheckError && tableCheckError.code === '42P01') {
      console.log('Tabela visitors não existe. Criando...');
      
      // Cria a tabela visitors
      const { error: createTableError } = await supabase.rpc('create_visitors_table');
      
      if (createTableError) {
        console.error('Erro ao criar tabela:', createTableError);
        return false;
      }
      
      console.log('Tabela visitors criada com sucesso!');
    } else if (tableCheckError) {
      console.error('Erro ao verificar tabela:', tableCheckError);
      return false;
    } else {
      console.log('Tabela visitors já existe.');
    }

    // Insere alguns dados de exemplo se a tabela estiver vazia
    const { count, error: countError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Erro ao contar registros:', countError);
      return false;
    }

    if (count === 0) {
      console.log('Inserindo dados de exemplo...');
      
      const sampleData = [
        {
          name: 'João Silva',
          address: 'Vila Madalena, SP',
          lat: -23.5449,
          lng: -46.6929,
          visit_count: 5,
          is_new_visitor: false,
          distance: 8.2
        },
        {
          name: 'Maria Santos',
          address: 'Jardins, SP',
          lat: -23.5649,
          lng: -46.6544,
          visit_count: 1,
          is_new_visitor: true,
          distance: 3.1
        }
      ];

      const { error: insertError } = await supabase
        .from('visitors')
        .insert(sampleData);

      if (insertError) {
        console.error('Erro ao inserir dados de exemplo:', insertError);
        return false;
      }

      console.log('Dados de exemplo inseridos com sucesso!');
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return false;
  }
}

// Executa a configuração
setupDatabase().then(success => {
  if (success) {
    console.log('Configuração do banco de dados concluída com sucesso!');
  } else {
    console.error('Falha na configuração do banco de dados.');
  }
}); 