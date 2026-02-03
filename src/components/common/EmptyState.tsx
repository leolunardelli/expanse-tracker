interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {/* Icon */}
      {icon && <div className="mb-6">{icon}</div>}

      {/* Title */}
      <h3 className="text-xl font-display font-semibold text-dark-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-dark-500 dark:text-dark-400 max-w-sm mx-auto mb-6">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
