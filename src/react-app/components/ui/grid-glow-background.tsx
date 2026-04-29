"use client";

import React, { useRef, useEffect } from "react";

// GridGlowBackground Props
interface GridGlowBackgroundProps {
  children: React.ReactNode;
  backgroundColor?: string;    // default "#0a0a0a"
  gridColor?: string;          // default "rgba(255,255,255,0.05)"
  gridSize?: number;           // default 50
  glowColors?: string[];       // default ["#4A00E0","#8E2DE2","#4A00E0"]
  glowCount?: number;          // default 10
}

// Glow class defined outside component to prevent recreation
class Glow {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  speed: number;
  color: string;
  alpha: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gridSize: number;
  glowColors: string[];

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    gridSize: number,
    glowColors: string[]
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gridSize = gridSize;
    this.glowColors = glowColors;
    this.x =
      Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    this.y =
      Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    this.targetX = this.x;
    this.targetY = this.y;
    this.radius = Math.random() * 80 + 40;
    this.speed = Math.random() * 0.02 + 0.01;
    this.color = glowColors[Math.floor(Math.random() * glowColors.length)];
    this.alpha = 1;
    this.setNewTarget();
  }

  setNewTarget() {
    const currentGridX = Math.floor(this.x / this.gridSize);
    const currentGridY = Math.floor(this.y / this.gridSize);
    
    // Move to adjacent grid point for smoother motion
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 1 },
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
    ];
    
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const newGridX = currentGridX + direction.dx;
    const newGridY = currentGridY + direction.dy;
    
    // Ensure within bounds
    const maxGridX = Math.floor(this.canvas.width / this.gridSize) - 1;
    const maxGridY = Math.floor(this.canvas.height / this.gridSize) - 1;
    
    this.targetX = Math.max(0, Math.min(maxGridX, newGridX)) * this.gridSize;
    this.targetY = Math.max(0, Math.min(maxGridY, newGridY)) * this.gridSize;
  }

  update() {
    this.x += (this.targetX - this.x) * this.speed;
    this.y += (this.targetY - this.y) * this.speed;

    if (
      Math.abs(this.targetX - this.x) < 1 &&
      Math.abs(this.targetY - this.y) < 1
    ) {
      this.setNewTarget();
    }
  }

  draw() {
    this.ctx.globalAlpha = this.alpha;
    const grad = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, "transparent");
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
}

export const GridGlowBackground: React.FC<GridGlowBackgroundProps> = ({
  children,
  backgroundColor = "#0a0a0a",
  gridColor = "rgba(255, 255, 255, 0.05)",
  gridSize = 50,
  glowColors = ["#4A00E0", "#8E2DE2", "#4A00E0"],
  glowCount = 10,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowsRef = useRef<Glow[]>([]);
  const frameIdRef = useRef<number | undefined>(undefined);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Only recreate glows if not already initialized
      if (!isInitializedRef.current || glowsRef.current.length === 0) {
        glowsRef.current = Array.from({ length: glowCount }, () => 
          new Glow(canvas, ctx, gridSize, glowColors)
        );
        isInitializedRef.current = true;
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      glowsRef.current.forEach((g) => {
        g.update();
        g.draw();
      });
      frameIdRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative h-screen w-full"
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full opacity-50"
      />
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GridGlowBackground;
