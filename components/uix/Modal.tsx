'use client';
import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}
export default function Modal({ isOpen, onClose, children, title = 'Details', className }: ModalProps) {
  return <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className={className} aria-describedby={undefined}>
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <div className="pt-5">{children}</div>
    </DialogContent>
  </Dialog>;
}
