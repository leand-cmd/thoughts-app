import './App.css';
import ThoughtCloud from './components/ThoughtCloud';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Nube de Pensamientos</h1>
        <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Visualización de tus ideas conectadas</p>
        <ThoughtCloud />
      </div>
    </div>
  );
}

export default App;
