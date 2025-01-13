import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { CalendarHeader } from './CalendarHeader';
import { TaskModal } from './TaskModal';
import { api, Country } from '../services/api';
import { Task, labels, Holiday } from '../types/types';
import styles from '../styles/Calendar.module.css';

const LOCAL_STORAGE_KEY = 'calendarTasks';

export const Calendar: React.FC<{ initialDate?: Date }> = ({ initialDate = new Date() }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [view, setView] = useState<'week' | 'month'>('month');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalData, setModalData] = useState<{ date: string; task?: Task } | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(initialDate);

  useEffect(() => {
    const loadCountries = async () => {
      const availableCountries = await api.getAvailableCountries();
      setCountries(availableCountries);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadHolidays = async () => {
      const year = currentDate.getFullYear();
      const holidays = await api.getPublicHolidays(year, selectedCountry);
      setHolidays(holidays);
    };
    loadHolidays();
  }, [selectedCountry, currentDate]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
      }
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks to local storage:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, date } : t
    );
    saveTasks(updatedTasks);
  };

  const handleTaskSave = (taskData: Omit<Task, 'id'>) => {
    let updatedTasks: Task[];
    if (modalData?.task) {
      updatedTasks = tasks.map(task =>
        task.id === modalData.task!.id
          ? { ...task, ...taskData }
          : task
      );
    } else {
      const newTask = { ...taskData, id: Date.now().toString() };
      updatedTasks = [...tasks, newTask];
    }
    saveTasks(updatedTasks);
  };


  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilters.length === 0 || task.labelIds.some(id => activeFilters.includes(id)))
  );

  const toggleFilter = (labelId: string) => {
    setActiveFilters(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let startDate: Date;
    let endDate: Date;

    if (view === 'month') {
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    } else {
      const dayOfWeek = currentDate.getDay();
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - dayOfWeek);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    }

    const firstDayOfGrid = startDate.getDay();

    for (let i = 0; i < firstDayOfGrid; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.calendarCell} ${styles[view]}`} />);
    }

    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
      const dateStr = day.toISOString().split('T')[0];
      const isToday = day.toDateString() === new Date().toDateString();
      const tasksForDay = filteredTasks.filter(task => task.date === dateStr);
      const holiday = holidays.find(h => h.date === dateStr);

      days.push(
        <div
          key={dateStr}
          className={`${styles.calendarCell} ${isToday ? styles.today : ''} ${styles[view]}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, dateStr)}
        >
          <div className={`${styles.dateNumber} ${isToday ? styles.today : ''}`}>{day.getDate()}</div>
          {holiday && <div className={styles.holidayTag}>{holiday.name}</div>}
          <div className={styles.taskList}>
            {tasksForDay.map((task) => (
              <div
                key={task.id}
                className={styles.taskCard}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onClick={() => setModalData({ date: dateStr, task })}
              >
                <span>{task.text}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div className={styles.labelIndicators}>
                    {task.labelIds.map(id => (
                      <div
                        key={id}
                        className={styles.labelIndicator}
                        style={{ backgroundColor: labels.find(l => l.id === id)?.color || '#ddd' }}
                      />
                    ))}
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskDelete(task.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div className={styles.addTaskButton} onClick={() => setModalData({ date: dateStr })}>
              + 
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendarContainer}>
      <CalendarHeader
        countries={countries}
        selectedCountry={selectedCountry}
        view={view}
        onCountryChange={setSelectedCountry}
        onViewChange={setView}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />
      <div className={styles.searchContainer}>
        <Search size={20} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div style={{ position: 'relative' }}>
          <button
            className={`${styles.filterButton} ${activeFilters.length > 0 ? styles.active : ''}`}
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
          >
            <Filter size={20} />
            Filter
          </button>
          {filterMenuOpen && (
            <div className={styles.filterMenu}>
              {labels.map(label => (
                <label key={label.id} className={styles.filterOption}>
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(label.id)}
                    onChange={() => toggleFilter(label.id)}
                  />
                  {label.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
      {modalData && (
        <TaskModal
          date={modalData.date}
          task={modalData.task}
          onClose={() => setModalData(null)}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
};

