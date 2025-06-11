import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import githubReducer from '../store/githubSlice';
import Home from './Home';

const createMockStore = () => {
  return configureStore({
    reducer: {
      github: githubReducer,
    },
  });
};

const renderWithProviders = (component) => {
  const store = createMockStore();
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('Home Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('deve renderizar o formulário de busca corretamente', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByPlaceholderText(/digite o nome do usuário/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
    expect(screen.getByText(/busque por um usuário do github/i)).toBeInTheDocument();
  });

  test('deve atualizar o valor do input quando o usuário digita', () => {
    renderWithProviders(<Home />);
    
    const input = screen.getByPlaceholderText(/digite o nome do usuário/i);
    fireEvent.change(input, { target: { value: 'testuser' } });
    
    expect(input.value).toBe('testuser');
  });

  test('não deve permitir submissão com input vazio', () => {
    renderWithProviders(<Home />);
    
    const submitButton = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/por favor, digite um nome de usuário/i)).toBeInTheDocument();
  });

  test('deve limpar mensagens de erro quando o usuário começa a digitar', () => {
    renderWithProviders(<Home />);
    
    const input = screen.getByPlaceholderText(/digite o nome do usuário/i);
    const submitButton = screen.getByRole('button', { name: /buscar/i });
    
    fireEvent.click(submitButton);
    expect(screen.getByText(/por favor, digite um nome de usuário/i)).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.queryByText(/por favor, digite um nome de usuário/i)).not.toBeInTheDocument();
  });

  test('deve mostrar loading state durante a busca', async () => {
    const { store } = renderWithProviders(<Home />);
    
    const input = screen.getByPlaceholderText(/digite o nome do usuário/i);
    const submitButton = screen.getByRole('button', { name: /buscar/i });
    
    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/buscando/i)).toBeInTheDocument();
  });

  test('deve persistir o último usuário buscado no localStorage', () => {
    renderWithProviders(<Home />);
    
    const input = screen.getByPlaceholderText(/digite o nome do usuário/i);
    const submitButton = screen.getByRole('button', { name: /buscar/i });
    
    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(submitButton);
    
    expect(localStorage.getItem('lastSearchedUser')).toBe('testuser');
  });
}); 