import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserDetails from './UserDetails';

const mockStore = configureStore([thunk]);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ username: 'EdsonnOliveira' }),
}));

describe('UserDetails', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      github: {
        user: null,
        repos: [],
        loading: false,
        error: null,
      },
    });
    mockNavigate.mockClear();
  });

  it('deve mostrar o loading quando estiver carregando', () => {
    store = mockStore({
      github: {
        user: null,
        repos: [],
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando houver erro', () => {
    store = mockStore({
      github: {
        user: null,
        repos: [],
        loading: false,
        error: 'Erro ao carregar usuário',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Erro ao carregar usuário')).toBeInTheDocument();
  });

  it('deve renderizar os detalhes do usuário corretamente', () => {
    const mockUser = {
      login: 'EdsonnOliveira',
      name: 'Edson Pinheiro de Oliveira',
      avatar_url: 'https://avatars.githubusercontent.com/u/EdsonnOliveira',
      bio: 'Desenvolvedor Full Stack',
      followers: 42,
      following: 38,
      public_repos: 15,
      email: 'edsonpinheiroliveira@gmail.com',
    };

    const mockRepos = [
      {
        id: 1,
        name: 'github-finder',
        description: 'Aplicação para buscar usuários do GitHub',
        stargazers_count: 5,
        language: 'JavaScript',
      },
      {
        id: 2,
        name: 'portfolio',
        description: 'Meu portfólio pessoal',
        stargazers_count: 3,
        language: 'TypeScript',
      }
    ];

    store = mockStore({
      github: {
        user: mockUser,
        repos: mockRepos,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Edson Pinheiro de Oliveira')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor Full Stack')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('38')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('edsonpinheiroliveira@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('github-finder')).toBeInTheDocument();
    expect(screen.getByText('portfolio')).toBeInTheDocument();
  });

  it('deve chamar a função de navegação ao clicar no botão voltar', () => {
    store = mockStore({
      github: {
        user: { login: 'EdsonnOliveira' },
        repos: [],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      </Provider>
    );

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve atualizar a ordenação dos repositórios', async () => {
    const mockUser = {
      login: 'EdsonnOliveira',
      name: 'Edson Pinheiro de Oliveira',
    };

    const mockRepos = [
      {
        id: 1,
        name: 'github-finder',
        description: 'Aplicação para buscar usuários do GitHub',
        stargazers_count: 5,
        language: 'JavaScript',
      }
    ];

    store = mockStore({
      github: {
        user: mockUser,
        repos: mockRepos,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      </Provider>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'updated' } });

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual(
        expect.objectContaining({
          type: expect.stringContaining('fetchUserRepos'),
          payload: expect.objectContaining({
            sort: 'updated',
            username: 'EdsonnOliveira'
          }),
        })
      );
    });
  });
}); 