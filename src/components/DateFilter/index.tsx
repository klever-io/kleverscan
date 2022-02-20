import { ArrowLeft, ArrowRight, WarningIcon } from '@/assets/calendar';
import { MdClear } from 'react-icons/md';
import React, { useEffect, useRef, useState } from 'react';
import {
  CalendarContainer,
  CalendarContent,
  CalendarHeader,
  Confirm,
  Container,
  DayItem,
  DayPicker,
  DaysTable,
  HeaderItem,
  HeaderRow,
  Input,
  MonthPicker,
  OutsideContainer,
  OutsideContent,
  Warning,
} from './styles';

import { Calendar as CalendarIcon } from '@/assets/icons';
export interface ISelectedDays {
  start: Date;
  end: Date | null;
  values: Date[];
}

export interface IDateFilter {
  filterDate(selectedDays: ISelectedDays): void;
  resetDate(): void;
  empty: boolean;
}

const DateFilter: React.FC<IDateFilter> = ({
  filterDate,
  resetDate,
  empty,
}) => {
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const auxDate = new Date();
  const currentDate = new Date(
    auxDate.getFullYear(),
    auxDate.getMonth(),
    auxDate.getDate(),
  );
  const [date, setDate] = useState(currentDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [monthDays, setMonthDays] = useState(
    Array.from(Array(31).keys()).map(
      i => new Date(date.getFullYear(), date.getMonth(), i + 1),
    ),
  );
  const selectedDaysInitialValue: ISelectedDays = {
    start: currentDate,
    end: currentDate,
    values: [],
  };
  const [selectedDays, setSelectedDays] = useState<ISelectedDays>(
    selectedDaysInitialValue,
  );
  const [startingDay, setStartingDay] = useState(currentDate.getDay());
  const [warning, setWarning] = useState(false);
  const [firstSelection, setFirstSelection] = useState(true);
  const [dontBlur, setDontBlur] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [buttonActive, setButtonActive] = useState(true);

  const inputRef = useRef<any>(null);

  const handleInputFocus = () => {
    setCalendarOpen(true);
  };

  const handleArrowClick = (side: string) => {
    const newDate = new Date(date);
    newDate.setDate(1);

    if (side === 'left') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDate(newDate);
  };
  useEffect(() => {
    empty ? setWarning(true) : setWarning(false);
  }, [empty]);

  useEffect(() => {
    setMonthDays(
      Array.from(
        Array(
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), // max days in a month
        ).keys(),
      ).map(i => new Date(date.getFullYear(), date.getMonth(), i + 1)),
    );
    setStartingDay(new Date(date.getFullYear(), date.getMonth(), 1).getDay());
  }, [date]);

  const handleDayClick = (day: Date) => {
    if (firstSelection) {
      setSelectedDays({
        start: day,
        end: null,
        values: [day],
      });
      setFirstSelection(false);
      setButtonActive(true);
    } else if (!firstSelection) {
      if (selectedDays.start && day < selectedDays.start) {
        const prevStart = selectedDays.start;
        setSelectedDays({
          ...selectedDays,
          end: prevStart,
          start: day,
        });
      } else {
        setSelectedDays({
          ...selectedDays,
          end: day,
        });
      }
      setFirstSelection(true);
    }
  };

  useEffect(() => {
    if (selectedDays.end) {
      const daysBetween = Math.round(
        (selectedDays.end.getTime() - selectedDays.start.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (daysBetween > 0) {
        const newValues = Array.from(Array(daysBetween + 1).keys()).map(
          i => new Date(selectedDays.start.getTime() + i * 24 * 60 * 60 * 1000),
        );

        setSelectedDays({
          ...selectedDays,
          values: newValues,
        });
        setButtonActive(true);
      } else if (daysBetween === 0 && firstSelection) {
        setSelectedDays({
          ...selectedDays,
          values: [],
        });
        setButtonActive(false);
      }
    }
  }, [selectedDays.end]);

  const handleConfirmClick = () => {
    filterDate(selectedDays);

    setInputValue(
      `${selectedDays.start.toLocaleString().split(',')[0]}${
        selectedDays.end
          ? ' - ' + selectedDays.end.toLocaleString().split(',')[0]
          : ''
      }`,
    );
    setDate(selectedDays.start);
    inputRef.current.blur();
    setCalendarOpen(false);
    setButtonActive(false);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedDays({
      start: currentDate,
      end: currentDate,
      values: [],
    });
    setFirstSelection(true);
    setDate(currentDate);
    setCalendarOpen(false);

    resetDate();
  };
  const handleClose = () => {
    setDontBlur(false);
    setCalendarOpen(false);
    inputRef.current.blur();
    setSelectedDays(selectedDaysInitialValue);
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <Container
      onBlur={() => !dontBlur && setCalendarOpen(false)}
      onMouseEnter={() => setDontBlur(true)}
      onMouseLeave={() => setDontBlur(false)}
    >
      <OutsideContainer>
        <OutsideContent onClick={() => inputRef.current.focus()}>
          <Input
            type="text"
            placeholder="Add filter by date"
            onFocus={() => handleInputFocus()}
            value={inputValue}
            ref={inputRef}
          />
          {!inputRef.current?.value && <CalendarIcon />}
        </OutsideContent>
        {inputRef.current?.value && <MdClear onClick={handleClear} />}
      </OutsideContainer>

      {calendarOpen && (
        <CalendarContainer onMouseDown={e => e.preventDefault()}>
          <CalendarHeader>
            <strong>
              <span>Date Filter</span>
              <MdClear onClick={handleClose} />
            </strong>
            <p>Choose the proper date that you want to be listed down below</p>
          </CalendarHeader>
          <CalendarContent>
            <MonthPicker
              isDisabledRight={
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear()
              }
            >
              <ArrowLeft onClick={() => handleArrowClick('left')} />
              {months[date.getMonth()]} {date.getFullYear()}
              <ArrowRight onClick={() => handleArrowClick('right')} />
            </MonthPicker>
            <DayPicker>
              <HeaderRow>
                {weekdays.map(day => {
                  return <HeaderItem key={day}>{day}</HeaderItem>;
                })}
              </HeaderRow>
              <DaysTable>
                {Array.from(Array(startingDay).keys()).map(i => (
                  <DayItem key={i} />
                ))}
                {monthDays.map(day => {
                  return (
                    <DayItem
                      key={day.getTime()}
                      isKey={
                        !!selectedDays.values.find(
                          d => d.getTime() === day.getTime(),
                        ) &&
                        (selectedDays.start.getTime() === day.getTime() ||
                          selectedDays.end?.getTime() === day.getTime())
                      }
                      isBetween={
                        !!selectedDays.values.find(
                          d => d.getTime() === day.getTime(),
                        )
                      }
                      isAfter={day.getTime() > currentDate.getTime()}
                      isCurrent={day.getTime() === currentDate.getTime()}
                      onClick={() => handleDayClick(day)}
                    >
                      {day.getDate()}
                    </DayItem>
                  );
                })}
              </DaysTable>
            </DayPicker>
            {warning && (
              <Warning>
                <WarningIcon />
                <span>Nothing on this date</span>
              </Warning>
            )}
            <Confirm onClick={handleConfirmClick} isActive={buttonActive}>
              {' '}
              Confirm
            </Confirm>
          </CalendarContent>
        </CalendarContainer>
      )}
    </Container>
  );
};

export default DateFilter;
