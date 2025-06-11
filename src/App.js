import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Home from './pages/Home';
import UserDetails from './pages/UserDetails';
import RepositoryDetails from './pages/RepositoryDetails';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/:username" element={<UserDetails />} />
            <Route path="/repository/:owner/:repo" element={<RepositoryDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
