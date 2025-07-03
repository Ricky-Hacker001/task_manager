
import { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import TaskDashboard from '../components/TaskDashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('taskAppUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('taskAppUser', username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskAppUser');
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentUser ? (
        <TaskDashboard username={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Index;
