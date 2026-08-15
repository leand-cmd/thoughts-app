import './App.css';
import { useState } from 'react';
import ThoughtCloud from './components/ThoughtCloud';
import FormPensamiento from './components/FormPensamiento';
import AnalysisDashboard from './components/AnalysisDashboard';
import GymPage from './pages/GymPage';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activePage, setActivePage] = useState('pensamientos');

  const handleThoughtAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f1e 100%)', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActivePage('pensamientos')}
            style={{
              padding: '10px 20px',
              backgroundColor: activePage === 'pensamientos' ? '#0070ff' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activePage === 'pensamientos' ? 'bold' : 'normal'
            }}
          >
            🧠 Pensamientos
          </button>
          <button
            onClick={() => setActivePage('gym')}
            style={{
              padding: '10px 20px',
              backgroundColor: activePage === 'gym' ? '#0070ff' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activePage === 'gym' ? 'bold' : 'normal'
            }}
          >
            💪 Gym
          </button>
        </div>

        {activePage === 'pensamientos' && (
          <>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Nube de Pensamientos</h1>
            <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Visualización de tus ideas conectadas</p>
            <FormPensamiento onThoughtAdded={handleThoughtAdded} />
            <ThoughtCloud key={refreshKey} />
            <AnalysisDashboard />
          </>
        )}

        {activePage === 'gym' && <GymPage />}
      </div>
    </div>
  );
}

export default App;
