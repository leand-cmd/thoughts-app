import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AnalysisDashboard = () => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetch('/analysis_deep.json')
      .then(res => res.json())
      .then(data => setAnalysis(data))
      .catch(err => console.error('Error loading analysis:', err));
  }, []);

  if (!analysis) return <div style={{ color: '#fff', padding: '20px' }}>Cargando análisis...</div>;

  const personalityData = [
    { trait: 'Apertura', value: (analysis.personality_matrix?.apertura || 0.7) * 100 },
    { trait: 'Responsabilidad', value: (analysis.personality_matrix?.responsabilidad || 0.85) * 100 },
    { trait: 'Extroversión', value: (analysis.personality_matrix?.extroversion || 0.5) * 100 },
    { trait: 'Amabilidad', value: (analysis.personality_matrix?.amabilidad || 0.75) * 100 },
    { trait: 'Estabilidad', value: (analysis.personality_matrix?.estabilidad || 0.3) * 100 },
  ];

  const emotionalTimeline = analysis.timeline || [];

  const sentimentMap = { 'positivo': 3, 'neutro': 2, 'negativo': 1 };
  const timelineData = emotionalTimeline.map((t, i) => ({
    day: `Día ${t.dia}`,
    sentiment: sentimentMap[t.sentimiento] || 2
  }));

  const criticalAreasData = (analysis.critical_areas || []).map(area => ({
    area: area.area.substring(0, 12),
    urgencia: area.urgencia === 'CRÍTICA' ? 3 : area.urgencia === 'ALTA' ? 2 : 1,
    full_area: area.area,
    recom: area.recomendacion
  }));

  const strengthsWeaknesses = [
    { name: 'Fortalezas', value: (analysis.psychological_profile?.strengths || []).length },
    { name: 'Debilidades', value: (analysis.psychological_profile?.weaknesses || []).length }
  ];

  const colors = ['#10b981', '#ef4444'];

  return (
    <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px', marginTop: '24px' }}>
      <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '24px' }}>📊 Dashboard Psicológico Completo</h2>

      {/* RESUMEN EJECUTIVO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Total Pensamientos</div>
          <div style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>{analysis.summary?.total_thoughts}</div>
        </div>
        <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>🟢 Positivos</div>
          <div style={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}>{analysis.summary?.positive}</div>
        </div>
        <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>🔴 Negativos ({analysis.summary?.negativity_percent}%)</div>
          <div style={{ color: '#ef4444', fontSize: '28px', fontWeight: 'bold' }}>{analysis.summary?.negative}</div>
        </div>
        <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>⚡ Energía Mental</div>
          <div style={{ color: '#f59e0b', fontSize: '28px', fontWeight: 'bold' }}>{Math.round((analysis.summary?.positive / analysis.summary?.total_thoughts * 100) || 0)}%</div>
        </div>
      </div>

      {/* RADAR CHART - PERSONALIDAD */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>🎯 Perfil de Personalidad (Big Five)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={personalityData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="trait" stroke="#9ca3af" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
            <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* TIMELINE EMOCIONAL */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>📈 Timeline Emocional (Últimos 10 Pensamientos)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timelineData}>
            <CartesianGrid stroke="#374151" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 3]} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
            <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ÁREAS CRÍTICAS */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>🚨 Áreas Críticas (Urgencia vs Impacto)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={criticalAreasData}>
            <CartesianGrid stroke="#374151" />
            <XAxis dataKey="area" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
              content={({ payload }) => {
                if (payload?.[0]) {
                  return (
                    <div style={{ padding: '10px', backgroundColor: '#1f2937', borderRadius: '4px', color: '#fff' }}>
                      <p>{payload[0].payload.full_area}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>Urgencia: {payload[0].payload.urgencia === 3 ? 'CRÍTICA' : payload[0].payload.urgencia === 2 ? 'ALTA' : 'MEDIA'}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="urgencia" fill="#3b82f6">
              {criticalAreasData.map((entry, index) => (
                <Cell key={index} fill={entry.urgencia === 3 ? '#ef4444' : entry.urgencia === 2 ? '#f59e0b' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FORTALEZAS vs DEBILIDADES */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>💪 Fortalezas vs Debilidades</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={strengthsWeaknesses}>
            <CartesianGrid stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }} />
            <Bar dataKey="value" fill="#3b82f6">
              {strengthsWeaknesses.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ARQUETIPOS */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>🎭 Arquetipos de Personalidad</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {(analysis.archetypes || []).map((arch, i) => (
            <div key={i} style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '4px', borderLeft: '3px solid #3b82f6', color: '#d1d5db' }}>
              {arch}
            </div>
          ))}
        </div>
      </div>

      {/* FORTALEZAS DETALLADAS */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#10b981', marginBottom: '12px' }}>✅ Fortalezas Identificadas</h3>
        {(analysis.psychological_profile?.strengths || []).map((s, i) => (
          <div key={i} style={{ color: '#d1d5db', marginBottom: '8px', paddingLeft: '12px', borderLeft: '3px solid #10b981' }}>
            {s}
          </div>
        ))}
      </div>

      {/* DEBILIDADES DETALLADAS */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>⚠️ Áreas de Mejora</h3>
        {(analysis.psychological_profile?.weaknesses || []).map((w, i) => (
          <div key={i} style={{ color: '#d1d5db', marginBottom: '8px', paddingLeft: '12px', borderLeft: '3px solid #ef4444' }}>
            {w}
          </div>
        ))}
      </div>

      {/* PRÓXIMAS ACCIONES */}
      <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>🎯 Plan de Acción (30 Días)</h3>
        {(analysis.psychological_profile?.priorities || []).map((p, i) => (
          <div key={i} style={{ color: '#d1d5db', marginBottom: '10px', paddingLeft: '12px', fontSize: '14px' }}>
            {p}
          </div>
        ))}
      </div>

      {/* RECOMENDACIONES CRÍTICAS */}
      {(analysis.critical_areas || []).length > 0 && (
        <div style={{ backgroundColor: '#7f1d1d', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: '#fca5a5', marginBottom: '16px' }}>🚨 Recomendaciones Críticas</h3>
          {(analysis.critical_areas || []).map((area, i) => (
            <div key={i} style={{ backgroundColor: '#5f0f0f', padding: '12px', borderRadius: '4px', marginBottom: '12px', borderLeft: '3px solid #ef4444' }}>
              <div style={{ color: '#fca5a5', fontWeight: 'bold' }}>{area.area}</div>
              <div style={{ color: '#fecaca', fontSize: '12px', marginTop: '4px' }}>{area.recomendacion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
