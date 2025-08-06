
'use client';

import React, { useState, useEffect } from 'react';
import { UserLocation } from '@/app/map/actions';

interface WorldMapProps {
  users: UserLocation[];
}

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 1000;

// Function to convert latitude and longitude to x, y coordinates using Mercator projection
function mercatorProjection(lat: number, lng: number) {
  const longitude = (lng + 180) * (MAP_WIDTH / 360);
  
  const latitudeRad = lat * Math.PI / 180;
  const mercatorN = Math.log(Math.tan((Math.PI / 4) + (latitudeRad / 2)));
  const latitude = (MAP_HEIGHT / 2) - (MAP_WIDTH * mercatorN / (2 * Math.PI));

  return { x: longitude / MAP_WIDTH * 100, y: latitude / MAP_HEIGHT * 100 };
}


export function WorldMap({ users }: WorldMapProps) {
  const [points, setPoints] = useState<{ x: number; y: number; user: UserLocation }[]>([]);

  useEffect(() => {
    const generatePoints = () => {
      return users
        .filter(user => typeof user.lat === 'number' && typeof user.lng === 'number')
        .map(user => {
          const { x, y } = mercatorProjection(user.lat!, user.lng!);
          return { x, y, user };
        });
    };
    setPoints(generatePoints());
  }, [users]);

  return (
    <div className="relative w-full h-full bg-background flex items-center justify-center overflow-hidden">
      {/* A stylized world map SVG */}
      <svg viewBox="0 0 2000 1000" className="absolute w-full h-full">
        <g>
            <path d="M0 0 L2000 0 L2000 1000 L0 1000 Z" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5"/>
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
