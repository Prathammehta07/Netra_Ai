import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Image as ImageIcon, Eye } from 'lucide-react';
import { LESION_COLORS } from './FindingBadge';

interface FindingLocation {
  x: number;
  y: number;
  radius: number;
}

interface FindingItem {
  type: string;
  locations?: FindingLocation[] | string;
  locationsJson?: string;
}

interface RetinalImageViewerProps {
  imageSrc: string;
  findings?: FindingItem[];
  alt?: string;
}

export const RetinalImageViewer: React.FC<RetinalImageViewerProps> = ({
  imageSrc,
  findings = [],
  alt = 'Retinal Fundus Image'
}) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Parse finding locations
  const parsedFindings = findings.map((f) => {
    let locs: FindingLocation[] = [];
    if (Array.isArray(f.locations)) {
      locs = f.locations;
    } else if (f.locationsJson) {
      try { locs = JSON.parse(f.locationsJson); } catch (e) { locs = []; }
    } else if (typeof f.locations === 'string') {
      try { locs = JSON.parse(f.locations); } catch (e) { locs = []; }
    }
    return { type: f.type, locations: locs };
  });

  // Draw overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !showOverlay) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth || img.width || 600;
    canvas.height = img.naturalHeight || img.height || 600;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render detected lesion markers
    parsedFindings.forEach((f) => {
      const info = LESION_COLORS[f.type.toLowerCase()] || { color: '#3b82f6' };

      f.locations.forEach((loc) => {
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, loc.radius * 1.5, 0, 2 * Math.PI);
        ctx.strokeStyle = info.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = info.color + '33'; // translucent fill
        ctx.fill();

        // Pulsing outer ring
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, loc.radius * 2.2, 0, 2 * Math.PI);
        ctx.strokeStyle = info.color + '88';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
  }, [showOverlay, imageSrc, findings]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg flex flex-col">
      {/* Top Toolbar */}
      <div className="p-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
        <div className="flex items-center space-x-2 font-medium">
          <Eye className="w-4 h-4 text-teal-400" />
          <span>Retinal Scan Viewer</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setShowOverlay(false)}
            className={`px-3 py-1 rounded-lg font-medium transition flex items-center space-x-1.5 ${
              !showOverlay ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Original</span>
          </button>
          <button
            onClick={() => setShowOverlay(true)}
            className={`px-3 py-1 rounded-lg font-medium transition flex items-center space-x-1.5 ${
              showOverlay ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Highlights</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1">
          <button onClick={handleZoomIn} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleReset} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200" title="Reset View">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full aspect-square sm:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        <div
          className="relative transition-transform duration-100 ease-out max-w-full max-h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            onLoad={() => {
              // Trigger canvas redraw on image load
              setShowOverlay((prev) => prev);
            }}
            className="max-h-[500px] w-auto object-contain mx-auto rounded-lg shadow-2xl"
          />

          {showOverlay && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Lesion Legend */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 text-white text-[11px] flex flex-wrap items-center justify-center gap-4">
        <span className="text-slate-400 font-semibold uppercase tracking-wider">Legend:</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Microaneurysms</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-slate-300">Hemorrhages</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">Exudates</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="text-slate-300">Abnormal Vessels</span>
        </div>
      </div>
    </div>
  );
};
