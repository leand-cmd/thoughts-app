import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ThoughtCloud = () => {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;

    // DATOS DE EJEMPLO (ficticios)
    const data = {
      nodes: [
        { id: "liderazgo", category: "profesional", size: 10 },
        { id: "cliente", category: "profesional", size: 8 },
        { id: "estrategia", category: "profesional", size: 8 },
        { id: "equipo", category: "profesional", size: 7 },
        { id: "confianza", category: "profesional", size: 6 },
        { id: "comunicación", category: "profesional", size: 7 },
        { id: "decisión", category: "profesional", size: 6 },
        { id: "proyecto", category: "profesional", size: 5 },
        { id: "energía", category: "personal", size: 7 },
        { id: "sueño", category: "personal", size: 6 },
        { id: "estrés", category: "personal", size: 5 },
        { id: "crecimiento", category: "profesional", size: 7 },
      ],
      links: [
        { source: "liderazgo", target: "cliente", strength: 0.9 },
        { source: "liderazgo", target: "equipo", strength: 0.85 },
        { source: "liderazgo", target: "comunicación", strength: 0.8 },
        { source: "cliente", target: "confianza", strength: 0.88 },
        { source: "cliente", target: "estrategia", strength: 0.82 },
        { source: "estrategia", target: "decisión", strength: 0.85 },
        { source: "equipo", target: "proyecto", strength: 0.8 },
        { source: "proyecto", target: "cliente", strength: 0.75 },
        { source: "liderazgo", target: "crecimiento", strength: 0.9 },
        { source: "energía", target: "sueño", strength: 0.85 },
        { source: "estrés", target: "energía", strength: 0.7 },
        { source: "crecimiento", target: "liderazgo", strength: 0.8 },
      ]
    };

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
        .distance(d => 100 / d.strength)
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
      .attr('stroke-width', d => d.strength * 3)
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

  }, []);

  return (
    <div style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px' }}>
      <svg ref={svgRef} style={{ width: '100%', border: '1px solid #374151', borderRadius: '8px' }}></svg>
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '8px' }}></div>
          <span style={{ color: '#fff' }}>Profesional</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px' }}></div>
          <span style={{ color: '#fff' }}>Personal</span>
        </div>
      </div>
    </div>
  );
};

export default ThoughtCloud;
