'use client';
import WhatsAppButton from '@/components/WhatsAppButton';
import styles from './support.module.css';
export default function SupportWhatsApp() {
  return (
    <div className={styles.whatsappPicker}>
      <WhatsAppButton
        waID="CUR7YKW3K3RBA1"
        variant="inline"
        triggerLabel="Reach us on WhatsApp"
        triggerClassName={styles.whatsappTrigger}
      />
    </div>
  );
}
