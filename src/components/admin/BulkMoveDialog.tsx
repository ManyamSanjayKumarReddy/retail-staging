import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';

export type BulkAction = 'move' | 'copy';

interface BulkMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  from: 'Items' | 'Rentals';
  to: 'Items' | 'Rentals';
  onConfirm: (action: BulkAction) => void;
  loading?: boolean;
}

export const BulkMoveDialog = ({
  open,
  onOpenChange,
  selectedCount,
  from,
  to,
  onConfirm,
  loading = false,
}: BulkMoveDialogProps) => {
  const [action, setAction] = useState<BulkAction>('move');

  return (
    <AlertDialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setAction('move'); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {action === 'move' ? (
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            ) : (
              <Copy className="h-6 w-6 text-primary" />
            )}
          </div>
          <AlertDialogTitle className="text-center">
            {action === 'move' ? 'Move' : 'Copy'} {selectedCount}{' '}
            {selectedCount === 1 ? 'item' : 'items'}?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-center text-sm text-muted-foreground">
              <p>
                You are about to {action} <strong>{selectedCount}</strong>{' '}
                {selectedCount === 1 ? 'product' : 'products'} from{' '}
                <strong>{from}</strong> to <strong>{to}</strong>.
              </p>

              {/* Action selector */}
              <div className="mx-auto mt-4 max-w-xs">
                <RadioGroup
                  value={action}
                  onValueChange={(v) => setAction(v as BulkAction)}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="action-move"
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                      action === 'move'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value="move" id="action-move" className="sr-only" />
                    <ArrowRightLeft className="h-5 w-5" />
                    <span className="font-medium text-foreground">Move</span>
                    <span className="text-xs text-muted-foreground">
                      Transfer to {to}
                    </span>
                  </Label>

                  <Label
                    htmlFor="action-copy"
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                      action === 'copy'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value="copy" id="action-copy" className="sr-only" />
                    <Copy className="h-5 w-5" />
                    <span className="font-medium text-foreground">Copy</span>
                    <span className="text-xs text-muted-foreground">
                      Duplicate to {to}
                    </span>
                  </Label>
                </RadioGroup>
              </div>

              <p className="mt-4 text-xs">
                {action === 'move'
                  ? `Items will be removed from ${from} and appear in ${to}.`
                  : `Original items stay in ${from}. Copies will appear in ${to}.`}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm(action);
            }}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : action === 'move' ? (
              <ArrowRightLeft className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Yes, {action} to {to}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
