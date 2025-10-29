'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvailabilityCalendarProps {
  homestayId: string;
  bookedDates?: Date[];
}

export function AvailabilityCalendar({ homestayId, bookedDates = [] }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Debug: Log booked dates
  console.log('AvailabilityCalendar - bookedDates:', bookedDates.length, bookedDates.slice(0, 5));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
    );
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Lịch Trống
        </h3>
        {bookedDates.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {bookedDates.length} ngày đã chặn
          </span>
        )}
      </div>

      <div className="rounded-xl border-2 border-border bg-card p-6 shadow-sm">
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="text-lg font-bold capitalize">{monthName}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week Day Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(year, month, day);
            const isBooked = isDateBooked(date);
            const isPast = isDatePast(date);
            const isAvailable = !isBooked && !isPast;

            return (
              <div
                key={day}
                className={`flex h-12 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  isPast
                    ? 'text-muted-foreground/30 bg-muted/20'
                    : isBooked
                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-800 relative'
                    : 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer'
                }`}
                title={
                  isPast
                    ? 'Đã qua'
                    : isBooked
                    ? 'Đã chặn - Không thể đặt'
                    : 'Còn trống - Có thể đặt'
                }
              >
                {day}
                {isBooked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-0.5 w-full bg-red-500 dark:bg-red-400 rotate-[-45deg]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 border-t-2 pt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800" />
            <span className="font-medium">Còn trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-red-100 dark:bg-red-950 border-2 border-red-300 dark:border-red-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-0.5 w-full bg-red-500 dark:bg-red-400 rotate-[-45deg]" />
              </div>
            </div>
            <span className="font-medium">Đã chặn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-muted/20" />
            <span className="font-medium text-muted-foreground">Đã qua</span>
          </div>
        </div>
      </div>
    </div>
  );
}
