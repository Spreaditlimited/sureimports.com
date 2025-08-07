interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    approved: {
      bg: 'bg-green-500/10',
      text: 'text-green-500'
    },
    pending: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500'
    },
    rejected: {
      bg: 'bg-red-500/10',
      text: 'text-red-500'
    }
  };

  const variant = variants[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0 rounded-full text-sm font-normal ${variant.bg} ${variant.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}