export default function StatsCard({ title, value, className }: { title: string; value: string | number; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800/50 p-6 ${className || ''}`}>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
