
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ShieldOff, Loader2 } from 'lucide-react';
import { suspendMember } from './actions';
import { useToast } from '@/hooks/use-toast';

interface MemberActionsProps {
  memberId: string;
  currentStatus: 'Active' | 'Suspended';
}

export function MemberActions({ memberId, currentStatus }: MemberActionsProps) {
    const [isSuspending, setIsSuspending] = useState(false);
    const { toast } = useToast();

    const handleSuspend = async () => {
        setIsSuspending(true);
        const result = await suspendMember(memberId);
        if (result.success) {
            toast({
                title: 'Success',
                description: 'Member has been suspended.',
            });
        } else {
             toast({
                title: 'Error',
                description: result.error || 'Failed to suspend member.',
                variant: 'destructive',
            });
        }
        setIsSuspending(false);
    }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => alert('Editing coming soon!')}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={handleSuspend} 
            disabled={currentStatus === 'Suspended' || isSuspending} 
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
            {isSuspending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <ShieldOff className="mr-2 h-4 w-4" />
            )}
            <span>Suspend</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
