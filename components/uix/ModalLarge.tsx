'use client';
import Modal, { type ModalProps } from './Modal';
export default function ModalLarge(props: ModalProps) {
  return <Modal {...props} className="max-w-4xl" />;
}
