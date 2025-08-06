
'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';

interface WelcomeCardProps {
  fullName: string;
  aetherId: string;
}

const quotes = [
  "The mother art is architecture. Without an architecture of our own, we have no soul of our own civilization.", // Frank Lloyd Wright
  "Architecture is the learned game, correct and magnificent, of forms assembled in the light.", // Le Corbusier
  "We shape our buildings; thereafter they shape us.", // Winston Churchill
  "Simplicity is the ultimate sophistication.", // Leonardo da Vinci
  "I don't divide architecture, landscape and gardening; to me they are one.", // Luis Barragán
];

function ParametricBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-10 dark:opacity-20">
                <defs>
                    <pattern id="parametric-pattern" patternUnits="userSpaceOnUse" width="100" height="100" >
                        <path d="M-10,10 l20,-20 M-10,90 l20,-20 M70,10 l20,-20 M70,90 l20,-20 M-10,50 l120,0 M-10,50 l20,-20 M-10,50 l-20,20 M30,50 l20,-20 M30,50 l-20,20 M70,50 l20,-20 M70,50 l-20,20 M110,50 l20,-20 M110,50 l-20,20" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#parametric-pattern)" />
            </svg>
        </div>
    );
}

export function WelcomeCard({ fullName, aetherId }: WelcomeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    // This check ensures this code only runs on the client
    if (typeof window !== 'undefined') {
      setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  }, []);

  const handleDownload = () => {
    if (cardRef.current) {
      toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, style: {
        backgroundColor: 'hsl(var(--background))',
      }})
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `aether-id-card-${aetherId}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Failed to download image', err);
        });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I\'ve joined the Aether Ecosystem!',
        text: `Excited to start my journey in design and architecture with Aether. My Aether ID is ${aetherId}.`,
        url: 'https://aether.build', // Replace with your actual URL
      }).catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        alert('Sharing is not supported on this browser. You can download the card and share it manually!');
    }
  };

  return (
    <div className="space-y-4 w-full max-w-lg mx-auto">
        <div ref={cardRef} className="relative bg-card text-card-foreground rounded-lg border shadow-sm p-6 sm:p-8 overflow-hidden">
            <ParametricBackground />
            <div className="relative z-10 text-center space-y-6">
                <div>
                    <p className="font-bold text-sm text-primary tracking-widest uppercase font-logo">WELCOME TO THE ECOSYSTEM</p>
                    <h2 className="text-3xl sm:text-4xl font-bold font-headline mt-2 break-words">{fullName}</h2>
                </div>

                <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground font-logo">YOUR AETHER ID</p>
                    <p className="text-xl sm:text-2xl font-bold tracking-widest text-primary font-mono">{aetherId}</p>
                </div>
                
                {randomQuote && (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground text-sm sm:text-base">
                      "{randomQuote}"
                  </blockquote>
                )}
            </div>
        </div>
      <div className="flex justify-center gap-4">
        <Button onClick={handleDownload} variant="outline">
          <Download className="mr-2" />
          Download
        </Button>
        <Button onClick={handleShare}>
          <Share2 className="mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
