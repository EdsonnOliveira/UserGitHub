import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

function RepositoryCard({ repository, username }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/repository/${username}/${repository.name}`);
  };

  return (
    <div
      className="card hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="font-semibold text-lg mb-2">{repository.name}</h3>
      <p className="text-gray-600 text-sm mb-4">
        {repository.description || 'Sem descrição'}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>⭐ {repository.stargazers_count}</span>
        {repository.language && <span>🔤 {repository.language}</span>}
      </div>
    </div>
  );
}

export default memo(RepositoryCard); 