import { ArrowLeft, ArrowRight, WarningIcon } from '@/assets/calendar';
import { Calendar as CalendarIcon } from '@/assets/icons';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdClear } from 'react-icons/md';
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

export interface ISelectedDays {
  start: Date;
  end: Date | null;
  values: Date[];
}

export interface IRouterDate {
  startdate: Date | string;
  enddate: Date | string;
}

export interface IDateFilter {
  filterDate(selectedDays: ISelectedDays): void;
  resetDate(): void;
  empty?: boolean;
}

const DateFilter: React.FC<IDateFilter> = ({
  filterDate,
  resetDate,
  empty,
}) => {
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const router = useRouter();

  const auxDate = new Date();
  const currentDate = new Date(
    auxDate.getFullYear(),
    auxDate.getMonth(),
    auxDate.getDate(),
  );

  const dateFromRouter = {
    startdate: new Date(Number(router.query.startdate)),
    enddate: new Date(Number(router.query.enddate)),
  };
  const selectedDaysInitialValue: ISelectedDays = {
    start: currentDate,
    end: currentDate,
    values: [],
  };

  const selectDays = () => {
    if (dateFromRouter.startdate.toString() !== 'Invalid Date') {
      selectedDaysInitialValue.start = dateFromRouter.startdate;
    }
    if (dateFromRouter.enddate.toString() !== 'Invalid Date') {
      selectedDaysInitialValue.end = dateFromRouter.enddate;
    }
  };
  selectDays();

  const formatInputInitialValue = () => {
    if (dateFromRouter.startdate.toString() === 'Invalid Date') {
      return '';
    }
    return `${selectedDaysInitialValue?.start?.toLocaleString().split(',')[0]}${
      selectedDaysInitialValue.end
        ? ' - ' + selectedDaysInitialValue?.end?.toLocaleString().split(',')[0]
        : ''
    }`;
  };

  const [date, setDate] = useState(currentDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [monthDays, setMonthDays] = useState(
    Array.from(Array(31).keys()).map(
      i => new Date(date.getFullYear(), date.getMonth(), i + 1),
    ),
  );
  const [selectedDays, setSelectedDays] = useState<ISelectedDays>(
    selectedDaysInitialValue,
  );
  const [startingDay, setStartingDay] = useState(currentDate.getDay());
  const [warning, setWarning] = useState(false);
  const [firstSelection, setFirstSelection] = useState(true);
  const [dontBlur, setDontBlur] = useState(false);
  const [inputValue, setInputValue] = useState(formatInputInitialValue());
  const [buttonActive, setButtonActive] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = useCallback(() => {
    setCalendarOpen(true);
  }, [setCalendarOpen]);

  const handleArrowClick = useCallback(
    (side: string) => {
      const newDate = new Date(date);
      newDate.setDate(1);

      if (side === 'left') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setDate(newDate);
    },
    [date],
  );

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

  const handleDayClick = useCallback(
    (day: Date) => {
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
    },
    [selectedDays, firstSelection],
  );

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

  const handleConfirmClick = useCallback(() => {
    filterDate(selectedDays);

    setInputValue(
      `${selectedDays?.start?.toLocaleString().split(',')[0]}${
        selectedDays.end
          ? ' - ' + selectedDays?.end?.toLocaleString().split(',')[0]
          : ''
      }`,
    );
    setDate(selectedDays.start);
    inputRef.current?.blur();
    setCalendarOpen(false);
    setButtonActive(false);
  }, [selectedDays, filterDate]);

  const handleClear = useCallback(() => {
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
  }, [resetDate]);

  const handleClose = useCallback(() => {
    setDontBlur(false);
    setCalendarOpen(false);
    inputRef.current?.blur();
    setSelectedDays(selectedDaysInitialValue);
  }, [selectedDaysInitialValue]);

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
        <OutsideContent onClick={() => inputRef.current?.focus()}>
          <Input
            type="text"
            placeholder="Add filter by date"
            onFocus={() => handleInputFocus()}
            value={inputValue}
            ref={inputRef}
            readOnly={true}
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
