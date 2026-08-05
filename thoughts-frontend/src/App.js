import './App.css';
import { useState } from 'react';
import ThoughtCloud from './components/ThoughtCloud';
import FormPensamiento from './components/FormPensamiento';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThoughtAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('https://thoughts-app-production.up.railway.app/api/thoughts/export/');
      const data = await response.json();

      // Crear archivo y descargar
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
      element.setAttribute('download', 'thoughts_export.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      alert('✅ Exportado: thoughts_export.json');
    } catch (error) {
      alert('❌ Error al exportar');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Nube de Pensamientos</h1>
        <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Visualización de tus ideas conectadas</p>

        <FormPensamiento onThoughtAdded={handleThoughtAdded} />

        <button
          onClick={handleExport}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          📥 Exportar Pensamientos
        </button>

        <ThoughtCloud key={refreshKey} />
      </div>
    </div>
  );
}

export default App;
