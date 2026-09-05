import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 bg-[#161d19] text-[#dde4dd] rounded-lg', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-between pt-1 relative items-center px-1',
        caption_label: 'text-xs font-mono-label text-[#dde4dd]',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-[#0D1117] border-[#242c27] text-[#bbcabf] p-0 hover:text-[#4edea3] hover:border-[#4edea3] hover:bg-[#101713]'
        ),
        nav_button_previous: '',
        nav_button_next: '',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-[#7e9184] rounded-md w-8 font-mono-code font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#102a20] [&:has([aria-selected])]:rounded-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-mono-code font-normal text-xs text-[#dde4dd] hover:bg-[#242c27] hover:text-[#4edea3] aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-[#4edea3] text-[#06120d] font-bold hover:bg-[#4edea3] hover:text-[#06120d] focus:bg-[#4edea3] focus:text-[#06120d]',
        day_today: 'border border-[#4edea3]/50 text-[#4edea3]',
        day_outside:
          'day-outside text-[#4a554f] opacity-50 aria-selected:bg-[#102a20]/50 aria-selected:text-[#7e9184] aria-selected:opacity-30',
        day_disabled: 'text-[#4a554f] opacity-50',
        day_range_middle:
          'aria-selected:bg-[#102a20] aria-selected:text-[#4edea3]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };

