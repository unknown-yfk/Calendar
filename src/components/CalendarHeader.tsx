


import React, { useState } from 'react';
import { Star, Users, CalendarIcon, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Country } from '../services/api';
import styles from '../styles/CalendarHeader.module.css';

interface CalendarHeaderProps {
  countries: Country[];
  selectedCountry: string;
  view: 'week' | 'month';
  onCountryChange: (countryCode: string) => void;
  onViewChange: (view: 'week' | 'month') => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  countries,
  selectedCountry,
  view,
  onCountryChange,
  onViewChange,
  currentDate,
  onDateChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    onDateChange(newDate);
  };

  const formatDate = (date: Date) => {
    if (view === 'month') {
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6);
      return `${date.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Calendar</h1>
        <Star size={20} />
        <Users size={20} />
       
      </div>
      <div className={`${styles.rightSection} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <span className={styles.currentDate}>{formatDate(currentDate)}</span>
        <select
          className={styles.select}
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          {countries.map((country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {country.name}
            </option>
          ))}
        </select>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${view === 'week' ? styles.active : ''}`}
            onClick={() => onViewChange('week')}
          >
            Week
          </button>
          <button
            className={`${styles.viewButton} ${view === 'month' ? styles.active : ''}`}
            onClick={() => onViewChange('month')}
          >
            Month
          </button>
        </div>
        <button className={styles.navButton} onClick={handlePrevious}>
          <ChevronLeft size={20} />
        </button>
        <button className={styles.navButton} onClick={handleNext}>
          <ChevronRight size={20} />
        </button>
        <CalendarIcon size={20} />
      </div>
    </header>
  );
};

