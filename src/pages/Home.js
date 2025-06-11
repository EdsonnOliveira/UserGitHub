import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../store/githubSlice';
import Button from '../components/Button';
import Input from '../components/Input';

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        await dispatch(fetchUser(username)).unwrap();
        navigate(`/user/${username}`);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Buscar Usuário GitHub
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite o nome do usuário"
            />
          </div>
          <Button type="submit" className="w-full">
            Buscar
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Home; 