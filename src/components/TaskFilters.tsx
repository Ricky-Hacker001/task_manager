
import { Button } from '@/components/ui/button';
import { FilterType } from './TaskDashboard';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    completed: number;
    pending: number;
    'high-priority': number;
    overdue: number;
  };
}

const TaskFilters = ({ currentFilter, onFilterChange, taskCounts }: TaskFiltersProps) => {
  const filters: { key: FilterType; label: string; count: number; color?: string }[] = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'pending', label: 'Pending', count: taskCounts.pending },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
    { key: 'high-priority', label: 'High Priority', count: taskCounts['high-priority'], color: 'text-red-600' },
    { key: 'overdue', label: 'Overdue', count: taskCounts.overdue, color: 'text-orange-600' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ key, label, count, color }) => (
        <Button
          key={key}
          variant={currentFilter === key ? 'default' : 'outline'}
          onClick={() => onFilterChange(key)}
          className={`transition-all duration-200 hover:scale-105 ${
            currentFilter === key 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : `hover:bg-blue-50 hover:border-blue-300 ${color || ''}`
          }`}
        >
          {label} ({count})
        </Button>
      ))}
    </div>
  );
};

export default TaskFilters;
