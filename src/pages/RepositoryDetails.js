import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepoDetails } from '../store/githubSlice';
import Button from '../components/Button';

function RepositoryDetails() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRepo: repoDetails, loading, error } = useSelector((state) => state.github);

  const handleOpenRepo = useCallback(() => {
    if (repoDetails?.html_url) {
      window.open(repoDetails.html_url, '_blank');
    }
  }, [repoDetails?.html_url]);

  useEffect(() => {
    const loadRepoDetails = async () => {
      try {
        await dispatch(fetchRepoDetails({ owner, repo })).unwrap();
      } catch (error) {
        console.error('Erro ao carregar detalhes do repositório:', error);
      }
    };
    loadRepoDetails();
  }, [dispatch, owner, repo]);

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
          <Button onClick={() => navigate(`/user/${owner}`)}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!repoDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          onClick={() => navigate(`/user/${owner}`)}
          className="btn-secondary mb-8"
        >
          Voltar
        </Button>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{repoDetails.name}</h1>
            <Button onClick={() => handleOpenRepo()}>
              Ver no GitHub
            </Button>
          </div>

          <p className="text-gray-600 mb-6">{repoDetails.description || 'Sem descrição'}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="font-semibold">Estrelas</p>
              <p className="text-gray-600">⭐ {repoDetails.stargazers_count}</p>
            </div>
            <div>
              <p className="font-semibold">Forks</p>
              <p className="text-gray-600">🔱 {repoDetails.forks_count}</p>
            </div>
            <div>
              <p className="font-semibold">Linguagem</p>
              <p className="text-gray-600">🔤 {repoDetails.language || 'Não especificada'}</p>
            </div>
            <div>
              <p className="font-semibold">Última atualização</p>
              <p className="text-gray-600">
                {new Date(repoDetails.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {repoDetails.topics && repoDetails.topics.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Tópicos</h2>
              <div className="flex flex-wrap gap-2">
                {repoDetails.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepositoryDetails; 