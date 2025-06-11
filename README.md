# GitHub User Search

Uma aplicação web React que permite buscar usuários do GitHub, visualizar seus dados e repositórios.

## Funcionalidades

- Busca de usuários do GitHub
- Visualização de detalhes do usuário (seguidores, seguindo, avatar, email, bio)
- Listagem de repositórios públicos
- Ordenação de repositórios por estrelas, nome ou data de atualização
- Visualização detalhada de repositórios
- Interface responsiva e moderna

## Tecnologias Utilizadas

- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Jest + Testing Library

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── store/         # Configuração do Redux
  ├── services/      # Serviços e APIs
```

## Testes

Para executar os testes:

```bash
npm test
# ou
yarn test
```
