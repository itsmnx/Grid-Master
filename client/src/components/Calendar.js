import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const Calendar = ({ completedDates = [], onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        const today = new Date();
        const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        // Don't allow going beyond current month
        if (nextMonthDate <= today) {
            setCurrentMonth(nextMonthDate);
        }
    };

    const isDateCompleted = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return completedDates.includes(dateStr);
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && 
               month === today.getMonth() && 
               year === today.getFullYear();
    };

    const isFutureDate = (day) => {
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    };

    const handleDateClick = (day) => {
        if (!isFutureDate(day)) {
            const date = new Date(year, month, day);
            setSelectedDate(date);
            if (onDateSelect) {
                // Pass the date string in YYYY-MM-DD format
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                onDateSelect(dateStr);
            }
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        
        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const completed = isDateCompleted(day);
            const today = isToday(day);
            const future = isFutureDate(day);
            
            days.push(
                <div
                    key={day}
                    className={`calendar-day ${completed ? 'completed' : ''} ${today ? 'today' : ''} ${future ? 'future' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    <span className="day-number">{day}</span>
                    {completed && <span className="checkmark">✓</span>}
                    {today && <span className="today-dot"></span>}
                </div>
            );
        }
        
        return days;
    };

    const canGoNext = () => {
        const today = new Date();
        const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        return nextMonthDate <= today;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button 
                    className="calendar-nav-btn" 
                    onClick={previousMonth}
                    aria-label="Previous month"
                >
                    ‹
                </button>
                <h3 className="calendar-title">
                    {monthNames[month]} {year}
                </h3>
                <button 
                    className="calendar-nav-btn" 
                    onClick={nextMonth}
                    disabled={!canGoNext()}
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>
            
            <div className="calendar-weekdays">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
            </div>
            
            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>
            
            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-box completed-box"></div>
                    <span>Completed</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box today-box"></div>
                    <span>Today</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box future-box"></div>
                    <span>Upcoming</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
