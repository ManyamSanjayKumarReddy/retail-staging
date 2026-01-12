import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SpecificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (key: string, value: string) => void;
}

const SpecificationModal: React.FC<SpecificationModalProps> = ({ open, onOpenChange, onAdd }) => {
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (specKey.trim()) {
      onAdd(specKey.trim(), specValue.trim());
      setSpecKey('');
      setSpecValue('');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSpecKey('');
    setSpecValue('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Specification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spec-key">Specification Name *</Label>
            <Input
              id="spec-key"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              placeholder="e.g., Color, Size, Material"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spec-value">Value (optional)</Label>
            <Input
              id="spec-value"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="e.g., Red, Large, Cotton"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!specKey.trim()}>
              Add Specification
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecificationModal;