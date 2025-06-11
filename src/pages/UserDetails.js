import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, fetchUserRepos } from '../store/githubSlice';
import Button from '../components/Button';
import Select from '../components/Select';
import RepositoryCard from '../components/RepositoryCard';

function UserDetails() {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, repos, loading, error } = useSelector((state) => state.github);
  const [sortBy, setSortBy] = useState('stars');

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, [setSortBy]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await dispatch(fetchUser(username)).unwrap();
        await dispatch(fetchUserRepos({ username, sort: sortBy })).unwrap();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadUserData();
  }, [dispatch, username, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          onClick={() => navigate('/')}
          className="btn-secondary mb-8"
        >
          Voltar
        </Button>

        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-32 h-32 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{user.name || user.login}</h1>
              <p className="text-gray-600 mb-4">{user.bio || 'Sem biografia'}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-semibold">Seguidores</p>
                  <p className="text-gray-600">{user.followers}</p>
                </div>
                <div>
                  <p className="font-semibold">Seguindo</p>
                  <p className="text-gray-600">{user.following}</p>
                </div>
                <div>
                  <p className="font-semibold">Repositórios</p>
                  <p className="text-gray-600">{user.public_repos}</p>
                </div>
                {user.email && (
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Repositórios</h2>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              className="max-w-xs"
            >
              <option value="stars">Mais estrelas</option>
              <option value="updated">Mais recentes</option>
              <option value="name">Nome</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                username={user.login}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails; 