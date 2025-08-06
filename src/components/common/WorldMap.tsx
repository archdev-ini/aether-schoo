
'use client';

import React, { useState, useEffect } from 'react';
import { UserLocation } from '@/app/map/actions';

interface WorldMapProps {
  users: UserLocation[];
}

export function WorldMap({ users }: WorldMapProps) {
  const [points, setPoints] = useState<{ x: number; y: number; user: UserLocation }[]>([]);

  useEffect(() => {
    // This is a placeholder for a proper geocoding solution.
    // For now, we'll generate random points on the map.
    const generatePoints = () => {
      return users.map(user => {
        // A simple hash to get a pseudo-random but consistent position for a user
        const hash = user.id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const x = (hash & 0xffff) % 100;
        const y = ((hash >> 16) & 0xffff) % 100;

        return { x, y, user };
      });
    };
    setPoints(generatePoints());
  }, [users]);

  return (
    <div className="relative w-full h-full bg-background flex items-center justify-center overflow-hidden">
      {/* A stylized world map SVG. You can replace this with any map you like. */}
      <svg viewBox="0 0 2000 1000" className="absolute w-full h-full">
        {/* Placeholder for a world map path. In a real scenario, this would be a detailed map. */}
        <path d="M... (a long path for a world map) ..." fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
        <g>
          <path d="M1000,434 l2,2h-4z M224,431 l1,-1h-2z M261,330 l-1,-1h2z M261,330 l-1,-1h2z M288,322 l-1, -1 h2z M284,333 l-1, -1 h2z M314,342 l-1, -1 h2z M323,342 l-1, -1 h2z M323,342 l-1, -1 h2z M337,344 l-1,-1h2z M342,354 l-1,-1h2z M342,370 l-1,-1h2z M342,384 l-1,-1h2z M342,392 l-1,-1h2z M342,406 l-1,-1h2z M342,422 l-1,-1h2z M342,434 l-1,-1h2z M342,442 l-1,-1h2z M342,453 l-1,-1h2z M342,467 l-1,-1h2z M342,481 l-1,-1h2z M342,492 l-1,-1h2z M342,504 l-1,-1h2z M342,514 l-1,-1h2z M342,525 l-1,-1h2z M342,536 l-1,-1h2z M342,548 l-1,-1h2z M342,560 l-1,-1h2z M342,571 l-1,-1h2z M342,583 l-1,-1h2z M342,595 l-1,-1h2z M342,607 l-1,-1h2z M342,618 l-1,-1h2z M342,629 l-1,-1h2z M342,640 l-1,-1h2z M342,651 l-1,-1h2z M342,662 l-1,-1h2z M342,673 l-1,-1h2z M342,684 l-1,-1h2z M342,695 l-1,-1h2z M342,706 l-1,-1h2z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5"/>
        </g>
      </svg>
      <div className="relative w-full h-full">
        {points.map((point, index) => (
          <div
            key={index}
            className="absolute group"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-primary/50 group-hover:bg-primary transition-all"
              style={{ animation: `pulse 2s ${index * 0.1}s infinite cubic-bezier(0.4, 0, 0.6, 1)` }}
            />
             <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 rounded-md bg-popover text-popover-foreground text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="font-bold">{point.user.fullName.split(' ')[0]}</p>
                <p>{point.user.location}</p>
                <p className="text-muted-foreground">wants to learn about {point.user.mainInterest}</p>
             </div>
          </div>
        ))}
      </div>
       <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.75);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

