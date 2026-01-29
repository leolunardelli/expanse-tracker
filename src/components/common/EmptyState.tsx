interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {/* Icon */}
      {icon && <div className="mb-4 text-6xl">{icon}</div>}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
