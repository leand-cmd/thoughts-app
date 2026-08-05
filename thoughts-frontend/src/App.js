import './App.css';
import { useState } from 'react';
import ThoughtCloud from './components/ThoughtCloud';
import FormPensamiento from './components/FormPensamiento';
import AnalysisDashboard from './components/AnalysisDashboard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThoughtAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Nube de Pensamientos</h1>
        <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Visualización de tus ideas conectadas</p>

        <FormPensamiento onThoughtAdded={handleThoughtAdded} />

        <ThoughtCloud key={refreshKey} />

        <AnalysisDashboard />
      </div>
    </div>
  );
}

export default App;
