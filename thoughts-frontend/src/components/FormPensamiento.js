import React, { useState } from 'react';
import API_BASE_URL from '../config';

const FormPensamiento = ({ onThoughtAdded }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('personal');
  const [sentiment, setSentiment] = useState('neutro');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/thoughts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          category,
          sentiment,
        }),
      });

      if (response.ok) {
        setText('');
        setCategory('personal');
        setSentiment('neutro');
        onThoughtAdded();
        alert('Pensamiento guardado!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el pensamiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#1f2937',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '24px'
    }}>
      <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
        Escribir Pensamiento
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu pensamiento..."
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '4px',
            border: '1px solid #374151',
            backgroundColor: '#111827',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            minHeight: '100px',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #374151',
                backgroundColor: '#111827',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            >
              <option value="personal">Personal</option>
              <option value="profesional">Profesional</option>
              <option value="liderazgo">Liderazgo</option>
              <option value="tecnico">Técnico</option>
              <option value="relaciones">Relaciones</option>
              <option value="mentalidad">Mentalidad</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Sentimiento</label>
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #374151',
                backgroundColor: '#111827',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            >
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
              <option value="neutro">Neutro</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Pensamiento'}
        </button>
      </form>
    </div>
  );
};

export default FormPensamiento;
