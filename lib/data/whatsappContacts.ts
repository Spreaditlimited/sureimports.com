export type WhatsAppContact = {
  id: string;
  label: string;
  description?: string;
  phone?: string;
  messageId?: string;
  defaultMessage?: string;
};

export const whatsappContacts: WhatsAppContact[] = [
  {
    id: 'general',
    label: 'General Enquiries',
    description: 'Sales, sourcing, shipping, and account support',
    messageId: 'CUR7YKW3K3RBA1',
  },
];
