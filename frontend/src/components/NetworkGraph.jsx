import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Share2, 
  Search, 
  Layers, 
  Info, 
  Zap, 
  Maximize2,
  RefreshCw 
} from 'lucide-react';
import { fetchNetworkGraph } from '../services/api';

export default function NetworkGraph() {
  const svgRef = useRef(null);
  const [networkData, setNetworkData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categoryColors = {
    'Technology': '#06b6d4', // Cyan
    'Gaming': '#ec4899',     // Pink
    'Sports': '#10b981',     // Emerald
    'Entertainment': '#f59e0b', // Amber
    'Business': '#8b5cf6',   // Violet
    'Environment': '#22c55e',// Green
    'Lifestyle': '#38bdf8',  // Sky
    'General': '#94a3b8'     // Slate
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    setLoading(true);
    const data = await fetchNetworkGraph();
    setNetworkData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!networkData || !svgRef.current) return;

    const width = svgRef.current.clientWidth || 800;
    const height = 550;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', height);

    // Zoom container
    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Deep copy nodes and links for simulation
    const nodes = networkData.nodes.map(d => ({ ...d }));
    const links = networkData.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => Math.max(40, 110 - d.weight * 6)))
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => Math.sqrt(d.volume) * 0.8 + 14));

    // Draw Links
    const link = g.append('g')
      .attr('stroke', 'rgba(255, 255, 255, 0.12)')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.min(6, Math.max(1, Math.sqrt(d.weight) * 0.9)))
      .attr('stroke-opacity', 0.6);

    // Node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on('click', (event, d) => {
        setSelectedNode(d);
      });

    // Glowing circle underneath
    node.append('circle')
      .attr('r', d => Math.min(26, Math.max(8, Math.sqrt(d.volume) * 0.6 + 4)))
      .attr('fill', d => categoryColors[d.category] || categoryColors['General'])
      .attr('opacity', 0.25)
      .attr('filter', 'blur(4px)');

    // Main circle
    node.append('circle')
      .attr('r', d => Math.min(22, Math.max(6, Math.sqrt(d.volume) * 0.5 + 3)))
      .attr('fill', d => categoryColors[d.category] || categoryColors['General'])
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => selectedNode?.id === d.id ? 3 : 1)
      .attr('stroke-opacity', 0.8)
      .attr('cursor', 'pointer');

    // Node text labels
    node.append('text')
      .text(d => d.id)
      .attr('x', 0)
      .attr('y', d => Math.min(22, Math.max(6, Math.sqrt(d.volume) * 0.5 + 3)) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('font-family', 'Inter, sans-serif')
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

  }, [networkData]);

  // Filtered nodes by search or category
  const filteredNodes = networkData ? networkData.nodes.filter(n => {
    const matchesSearch = n.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Main Graph Visualization Panel */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="glass-panel p-5 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <span>Hashtag Co-Occurrence & Community Network (SNA)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Social Network Analysis: Physics-simulated node centrality, betweenness, and community clustering
              </p>
            </div>

            <button
              onClick={loadGraph}
              className="btn-secondary text-xs px-3 py-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Layout</span>
            </button>
          </div>

          {/* D3 SVG Container */}
          <div className="w-full h-[550px] bg-slate-950/70 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Computing Network Centralities & Graph Coordinates...
              </div>
            ) : (
              <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            )}

            {/* Category Legend Overlay */}
            <div className="absolute bottom-3 left-3 glass-panel p-2.5 bg-slate-900/90 border-slate-800 flex flex-wrap gap-2 text-[11px] max-w-md">
              {Object.entries(categoryColors).map(([cat, col]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col }} />
                  <span className="text-slate-300 font-medium">{cat}</span>
                </div>
              ))}
            </div>

            {/* Instruction Badge */}
            <div className="absolute top-3 right-3 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              Drag nodes to rearrange • Scroll to zoom
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: Node Details & Centrality Inspector */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Node Search & Category Filter */}
        <div className="glass-panel p-4 space-y-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hashtag node (e.g. #AIRevolution)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 w-full placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {['All', 'Technology', 'Gaming', 'Sports', 'Business', 'Lifestyle'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Node Centrality Metrics */}
        {selectedNode ? (
          <div className="glass-panel p-5 space-y-4 border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Selected Node Analysis
                </span>
                <h3 className="text-xl font-bold text-white font-heading mt-0.5">
                  {selectedNode.id}
                </h3>
              </div>
              <span 
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${categoryColors[selectedNode.category]}20`,
                  color: categoryColors[selectedNode.category],
                  borderColor: `${categoryColors[selectedNode.category]}40`,
                  borderWidth: '1px'
                }}
              >
                {selectedNode.category}
              </span>
            </div>

            {/* Centrality Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 mb-1">Degree Centrality</div>
                <div className="text-lg font-bold font-mono text-cyan-300">
                  {selectedNode.degree_centrality || 0.05}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Connectedness ratio</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 mb-1">Betweenness Centrality</div>
                <div className="text-lg font-bold font-mono text-indigo-300">
                  {selectedNode.betweenness_centrality || 0.02}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Bridge bridge score</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 mb-1">Closeness Centrality</div>
                <div className="text-lg font-bold font-mono text-emerald-300">
                  {selectedNode.closeness_centrality || 0.35}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Shortest path mean</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 mb-1">Total Mentions</div>
                <div className="text-lg font-bold font-mono text-amber-300">
                  {selectedNode.volume.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Graph node weight</div>
              </div>

            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <span className="font-semibold text-cyan-400">Diffusion Note: </span>
              High degree and betweenness centrality tags act as cross-community information bridges, dramatically accelerating viral cascade probability.
            </div>

          </div>
        ) : (
          <div className="glass-panel p-6 text-center text-slate-400 flex flex-col items-center justify-center h-64 border-dashed">
            <Info className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">Click any node in the graph</p>
            <p className="text-xs text-slate-500 mt-1">
              Inspect Social Network Analysis (SNA) metrics including Degree, Closeness, and Betweenness centralities
            </p>
          </div>
        )}

        {/* Quick Node List */}
        <div className="glass-panel p-4 max-h-56 overflow-y-auto space-y-2">
          <div className="text-xs font-semibold text-slate-400 mb-1">
            Hashtag Directory ({filteredNodes.length} nodes)
          </div>
          {filteredNodes.slice(0, 8).map(n => (
            <div
              key={n.id}
              onClick={() => setSelectedNode(n)}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[n.category] || '#94a3b8' }} />
                <span className="text-slate-200 font-medium">{n.id}</span>
              </div>
              <span className="font-mono text-slate-400">{n.volume} posts</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
