
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarIcon, Tag } from 'lucide-react';
import TaskForm from './TaskForm';
import { Task } from './TaskDashboard';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskItem = ({ task, onUpdate, onDelete, onToggleComplete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (title: string, description: string, priority: 'low' | 'medium' | 'high', dueDate?: Date, category?: string, tags?: string[]) => {
    onUpdate(task.id, { title, description, priority, dueDate, category, tags });
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = task.dueDate && new Date() > task.dueDate && !task.completed;

  if (isEditing) {
    return (
      <div className="animate-scale-in">
        <TaskForm
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          initialTitle={task.title}
          initialDescription={task.description}
          initialPriority={task.priority}
          initialDueDate={task.dueDate}
          initialCategory={task.category}
          initialTags={task.tags}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
      task.completed 
        ? 'bg-green-50 border-green-200' 
        : isOverdue
          ? 'bg-red-50 border-red-200'
          : 'bg-white hover:bg-gray-50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1 transition-all duration-200 hover:scale-110"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-medium text-gray-900 break-words flex-1 transition-all duration-200 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 text-xs font-medium rounded-md border transition-all duration-200 ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
                {isOverdue && (
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 border border-red-200 animate-pulse">
                    OVERDUE
                  </span>
                )}
              </div>
            </div>
            
            {task.description && (
              <p className={`mt-1 text-sm break-words transition-all duration-200 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}

            <div className="mt-3 space-y-2">
              {/* Category and Due Date */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {task.category && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md transition-all duration-200 hover:bg-blue-200">
                    <Tag className="h-3 w-3" />
                    {task.category}
                  </span>
                )}
                
                {task.dueDate && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
                    isOverdue 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <CalendarIcon className="h-3 w-3" />
                    Due: {formatDate(task.dueDate)}
                  </span>
                )}
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md transition-all duration-200 hover:bg-purple-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Created/Updated dates */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                <span>Created: {formatDate(task.createdAt)}</span>
                {task.updatedAt > task.createdAt && (
                  <span className="sm:ml-2">Updated: {formatDate(task.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
            >
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"  
                  className="text-red-600 border-red-200 hover:bg-red-50 transition-all duration-200 hover:scale-105"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="animate-scale-in">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="transition-all duration-200 hover:scale-105">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(task.id)}
                    className="bg-red-600 hover:bg-red-700 transition-all duration-200 hover:scale-105"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
