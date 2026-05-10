import { useEffect, useRef } from 'react';
import { Shape } from '../types';

export default function CanvasRenderer({ shapes }: { shapes: Shape[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    shapes.forEach(shape => {
      ctx.fillStyle = shape.attributes.color;
      ctx.beginPath();
      
      const { x, y, size } = shape.attributes;

      switch (shape.type) {
        case 'circle':
          ctx.arc(x, y, size / 2, 0, Math.PI * 2);
          break;
        case 'rectangle':
          ctx.rect(x, y, size, size / 2);
          break;
        case 'square':
          ctx.rect(x, y, size, size);
          break;
        case 'triangle':
          ctx.moveTo(x, y - size / 2);
          ctx.lineTo(x - size / 2, y + size / 2);
          ctx.lineTo(x + size / 2, y + size / 2);
          ctx.closePath();
          break;
      }
      
      ctx.fill();
    });
  }, [shapes]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}
