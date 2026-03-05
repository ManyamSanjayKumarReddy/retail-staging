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
import { ArrowRightLeft, Loader2 } from 'lucide-react';

interface BulkMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  from: 'Items' | 'Rentals';
  to: 'Items' | 'Rentals';
  onConfirm: () => void;
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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center">
            Move {selectedCount} {selectedCount === 1 ? 'item' : 'items'}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You are about to move <strong>{selectedCount}</strong>{' '}
            {selectedCount === 1 ? 'product' : 'products'} from{' '}
            <strong>{from}</strong> to <strong>{to}</strong>.
            <br />
            <br />
            This will change how they appear on the public site. You can always
            move them back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRightLeft className="h-4 w-4" />
            )}
            Yes, move to {to}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
