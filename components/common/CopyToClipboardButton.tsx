
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CopyToClipboardButtonProps {
  textToCopy: string;
}

export function CopyToClipboardButton({ textToCopy }: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      toast({ description: "Aether ID copied to clipboard." });
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy ID: ', err);
      toast({ variant: "destructive", description: "Failed to copy ID." });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <span className="font-mono font-bold text-lg tracking-wider text-primary">{textToCopy}</span>
      {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}
