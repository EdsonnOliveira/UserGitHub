import axios from 'axios';

const BASE_URL = 'https://api.github.com';

export const searchUser = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar usuário');
  }
};

export const getUserRepos = async (username, sort = 'stars') => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}/repos`, {
      params: {
        sort,
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar repositórios');
  }
};

export const getRepoDetails = async (owner, repo) => {
  try {
    const response = await axios.get(`${BASE_URL}/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes do repositório');
  }
}; 