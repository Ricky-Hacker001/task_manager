
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilters from './TaskFilters';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category: string;
  tags: string[];
}

export type FilterType = 'all' | 'completed' | 'pending' | 'high-priority' | 'overdue';

interface TaskDashboardProps {
  username: string;
  onLogout: () => void;
}

const TaskDashboard = ({ username, onLogout }: TaskDashboardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load tasks and dark mode preference from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${username}`);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        priority: task.priority || 'medium',
        category: task.category || 'general',
        tags: task.tags || []
      }));
      setTasks(tasksWithDates);
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, [username]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
  }, [tasks, username]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = (title: string, description: string, priority: 'low' | 'medium' | 'high', dueDate?: Date, category: string = 'general', tags: string[] = []) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority,
      dueDate,
      category,
      tags
    };
    setTasks(prev => [newTask, ...prev]);
    setShowAddForm(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    updateTask(id, { completed: !tasks.find(t => t.id === id)?.completed });
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Status filter
    switch (filter) {
      case 'completed':
        return task.completed;
      case 'pending':
        return !task.completed;
      case 'high-priority':
        return task.priority === 'high' && !task.completed;
      case 'overdue':
        return task.dueDate && new Date() > task.dueDate && !task.completed;
      default:
        return true;
    }
  });

  const taskCounts = {
    all: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    'high-priority': tasks.filter(t => t.priority === 'high' && !t.completed).length,
    overdue: tasks.filter(t => t.dueDate && new Date() > t.dueDate && !t.completed).length
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>TaskMaster</h1>
            <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Welcome back, {username}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setDarkMode(!darkMode)}
              className="transition-all duration-200"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search and Add Task */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tasks, categories, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
            >
              Add New Task
            </Button>
          </div>

          {/* Add Task Form */}
          {showAddForm && (
            <div className="animate-fade-in">
              <TaskForm
                onSubmit={addTask}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {/* Task Filters */}
          <TaskFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
          />

          {/* Task List */}
          <div className="animate-fade-in">
            <TaskList
              tasks={filteredTasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onToggleComplete={toggleComplete}
            />
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className={`text-lg transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                {filter === 'all' && tasks.length === 0 
                  ? "No tasks yet. Create your first task to get started!"
                  : searchTerm 
                    ? `No tasks found matching "${searchTerm}"`
                    : `No ${filter} tasks found.`
                }
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskDashboard;
