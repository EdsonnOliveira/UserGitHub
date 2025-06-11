import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import RepositoryDetails from '../RepositoryDetails';

const mockStore = configureStore([thunk]);

describe('RepositoryDetails', () => {
  let store;
  const mockRepoDetails = {
    name: 'test-repo',
    description: 'Test repository',
    html_url: 'https://github.com/EdsonnOliveira/UserGitHub',
    stargazers_count: 100,
    forks_count: 50,
    language: 'JavaScript',
    updated_at: '2024-03-20T00:00:00Z',
    topics: ['react', 'javascript']
  };

  beforeEach(() => {
    store = mockStore({
      github: {
        selectedRepo: null,
        loading: false,
        error: null
      }
    });

    window.open = jest.fn();
  });

  it('deve renderizar o loading quando estiver carregando', () => {
    store = mockStore({
      github: {
        selectedRepo: null,
        loading: true,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RepositoryDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('deve renderizar mensagem de erro quando houver erro', () => {
    store = mockStore({
      github: {
        selectedRepo: null,
        loading: false,
        error: 'Erro ao carregar repositório'
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RepositoryDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Erro ao carregar repositório')).toBeInTheDocument();
  });

  it('deve renderizar os detalhes do repositório corretamente', async () => {
    store = mockStore({
      github: {
        selectedRepo: mockRepoDetails,
        loading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RepositoryDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('Test repository')).toBeInTheDocument();
    expect(screen.getByText('⭐ 100')).toBeInTheDocument();
    expect(screen.getByText('🔱 50')).toBeInTheDocument();
    expect(screen.getByText('🔤 JavaScript')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('deve abrir o repositório no GitHub quando clicar no botão', () => {
    store = mockStore({
      github: {
        selectedRepo: mockRepoDetails,
        loading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RepositoryDetails />
        </BrowserRouter>
      </Provider>
    );

    const verNoGitHubButton = screen.getByText('Ver no GitHub');
    fireEvent.click(verNoGitHubButton);

    expect(window.open).toHaveBeenCalledWith('https://github.com/EdsonnOliveira/UserGitHub', '_blank');
  });

  it('deve navegar de volta quando clicar no botão voltar', () => {
    store = mockStore({
      github: {
        selectedRepo: mockRepoDetails,
        loading: false,
        error: null
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <RepositoryDetails />
        </BrowserRouter>
      </Provider>
    );

    const voltarButton = screen.getByText('Voltar');
    fireEvent.click(voltarButton);

    expect(window.location.pathname).toBe('/user/undefined');
  });
}); 