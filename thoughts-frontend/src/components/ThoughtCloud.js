import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ThoughtCloud = () => {
  const svgRef = useRef();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const loadAndRenderGraph = async () => {
      try {
        // Cargar graph_data.json
        const response = await fetch('/graph_data.json');
        const data = await response.json();

        // Cargar análisis
        const analysisResponse = await fetch('/analysis.json');
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);

        if (!svgRef.current || !data.nodes || data.nodes.length === 0) {
          setLoading(false);
          return;
        }

        const width = svgRef.current.clientWidth;
        const height = 600;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
          .attr('width', width)
          .attr('height', height);

        const colorScale = d3.scaleOrdinal()
          .domain(['profesional', 'personal'])
          .range(['#3b82f6', '#10b981']);

        const simulation = d3.forceSimulation(data.nodes)
          .force('link', d3.forceLink(data.links)
            .id(d => d.id)
            .distance(d => 100 / (d.strength || 0.7))
          )
          .force('charge', d3.forceManyBody().strength(-500))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(d => d.size * 3));

        const link = svg.append('g')
          .selectAll('line')
          .data(data.links)
          .enter()
          .append('line')
          .attr('stroke', '#555')
          .attr('stroke-width', d => (d.strength || 0.7) * 3)
          .attr('opacity', 0.5);

        const node = svg.append('g')
          .selectAll('circle')
          .data(data.nodes)
          .enter()
          .append('circle')
          .attr('r', d => d.size)
          .attr('fill', d => colorScale(d.category))
          .attr('opacity', 0.8)
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
          );

        const labels = svg.append('g')
          .selectAll('text')
          .data(data.nodes)
          .enter()
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.3em')
          .attr('font-size', '12px')
          .attr('fill', '#fff')
          .attr('font-weight', 'bold')
          .text(d => d.id)
          .style('pointer-events', 'none');

        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

          labels
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        });

        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }

        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading graph:', error);
        setLoading(false);
      }
    };

    loadAndRenderGraph();
  }, []);

  return (
    <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px' }}>
      {loading && <p style={{ color: '#9ca3af' }}>Cargando análisis...</p>}

      <svg ref={svgRef} style={{ width: '100%', height: '600px', border: '1px solid #374151', borderRadius: '8px' }}></svg>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '8px' }}></div>
          <span style={{ color: '#fff' }}>Profesional</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px' }}></div>
          <span style={{ color: '#fff' }}>Personal</span>
        </div>
      </div>

      {analysis && (
        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>📊 Análisis de tus Pensamientos</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '4px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Total</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{analysis.summary.total_thoughts}</div>
            </div>
            <div style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '4px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>🟢 Positivos</div>
              <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>{analysis.summary.positive}</div>
            </div>
            <div style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '4px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>🔴 Negativos</div>
              <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>{analysis.summary.negative}</div>
            </div>
            <div style={{ backgroundColor: '#1f2937', padding: '12px', borderRadius: '4px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Conceptos</div>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{analysis.summary.unique_keywords}</div>
            </div>
          </div>

          <h4 style={{ color: '#fff', marginTop: '16px', marginBottom: '12px' }}>💡 Hallazgos Principales:</h4>
          <ul style={{ color: '#d1d5db', lineHeight: '1.8', paddingLeft: '20px' }}>
            {analysis.key_findings.map((finding, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{finding}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThoughtCloud;
