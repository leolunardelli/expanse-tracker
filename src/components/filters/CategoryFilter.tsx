import type { Category } from '../../types/index';

interface CategoryFilterProps {
  value: Category | 'all';
  onChange: (value: Category | 'all') => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by category
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Category | 'all')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All categories</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="entertainment">Entertainment</option>
        <option value="utilities">Utilities</option>
        <option value="shopping">Shopping</option>
        <option value="health">Health</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}
