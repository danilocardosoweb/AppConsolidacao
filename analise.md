# Análise do Projeto

## Estrutura Inicial de Diretórios

- `/public`: Arquivos estáticos.
- `/src`: Código fonte da aplicação.
- `/supabase`: Configurações ou arquivos relacionados ao Supabase.
- Arquivos de configuração na raiz: `package.json`, `bun.lockb`, `tsconfig.*`, `vite.config.ts`, `tailwind.config.ts`, `index.html`, etc.

## Tecnologias Identificadas

- **Frontend:** React, TypeScript, Vite
- **UI/Estilo:** shadcn/ui, Tailwind CSS, Radix UI
- **Gerenciamento de Pacotes:** Bun/npm/yarn
- **Backend/BD:** Supabase
- **Bibliotecas Principais:** React Router DOM, React Hook Form, Zod, React Query, Mapbox GL, Recharts, etc.

## Ponto de Entrada

- A aplicação inicia em `/src/main.tsx`, carregado via `index.html`.

## Propósito Aparente

- "Sistema de Visitantes - Igreja" (conforme título em `index.html` e README.md).

## Próximos Passos (Sugestão)

1.  Explorar o conteúdo da pasta `/src` para entender a organização do código fonte (componentes, páginas, serviços, etc.).
2.  Analisar como a integração com o Supabase está configurada e sendo utilizada.
3.  Mapear os fluxos principais da aplicação (ex: cadastro de visitante, visualização, etc.).
4.  Detalhar as dependências e como são utilizadas no código. 