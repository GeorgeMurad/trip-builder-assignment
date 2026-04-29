import { useEffect, useId, useRef, useState } from "react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function shiftMonth(year, month, delta) {
  let nextMonth = month + delta;
  let nextYear = year;

  while (nextMonth > 11) {
    nextMonth -= 12;
    nextYear += 1;
  }

  while (nextMonth < 0) {
    nextMonth += 12;
    nextYear -= 1;
  }

  return { year: nextYear, month: nextMonth };
}

function buildGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  return cells;
}

function toISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function parseISO(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MonthGrid({ year, month, selected, rangeStart, rangeEnd, minDate, onSelect }) {
  const cells = buildGrid(year, month);

  return (
    <div className="dp-month">
      <p className="dp-month-title">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="dp-week-row">
        {DAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="dp-day-grid">
        {cells.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} className="dp-day-cell" />;
          }

          const date = new Date(year, month, day);
          const isDisabled = minDate ? date < minDate : false;
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, selected);
          const isStart = isSameDay(date, rangeStart);
          const isEnd = isSameDay(date, rangeEnd);
          const inRange = rangeStart && rangeEnd && date > rangeStart && date < rangeEnd;

          const cellClass = [
            "dp-day-cell",
            isStart && rangeEnd ? "dp-day-cell--range-start" : "",
            isEnd && rangeStart ? "dp-day-cell--range-end" : "",
            inRange ? "dp-day-cell--in-range" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const buttonClass = [
            "dp-day",
            isSelected || isStart || isEnd ? "dp-day--selected" : "",
            isToday && !isSelected && !isStart && !isEnd ? "dp-day--today" : "",
            isDisabled ? "dp-day--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <span key={day} className={cellClass}>
              <button
                type="button"
                disabled={isDisabled}
                className={buttonClass}
                onClick={() => onSelect(toISO(year, month, day))}
              >
                {day}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DatePicker({
  id,
  name,
  label,
  value,
  rangeStart,
  rangeEnd,
  rangeMode = false,
  onApplyDates,
  onClearDates,
}) {
  const reactId = useId();
  const pickerId = `${name}-${reactId}`;
  const today = new Date();
  const seedDate = parseISO(value) ?? parseISO(rangeStart) ?? today;
  const wrapRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(seedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(seedDate.getMonth());
  const [draftStart, setDraftStart] = useState(rangeStart || value || "");
  const [draftEnd, setDraftEnd] = useState(rangeEnd || "");

  const minDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const draftStartDate = parseISO(draftStart);
  const draftEndDate = parseISO(draftEnd);
  const selectedDate = rangeMode ? null : draftStartDate;
  const nextMonth = shiftMonth(viewYear, viewMonth, 1);

  useEffect(() => {
    if (!open) {
      return;
    }

    const close = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    const handleAnotherPickerOpen = (event) => {
      if (event.detail?.pickerId !== pickerId) {
        setOpen(false);
      }
    };

    window.addEventListener("datepicker-open", handleAnotherPickerOpen);
    return () => window.removeEventListener("datepicker-open", handleAnotherPickerOpen);
  }, [pickerId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const openPicker = () => {
    const nextStart = rangeStart || value || "";
    const nextEnd = rangeEnd || "";
    const nextSeedDate = parseISO(value) ?? parseISO(nextStart) ?? today;

    setDraftStart(nextStart);
    setDraftEnd(nextEnd);
    setViewYear(nextSeedDate.getFullYear());
    setViewMonth(nextSeedDate.getMonth());
    window.dispatchEvent(
      new CustomEvent("datepicker-open", {
        detail: { pickerId },
      })
    );
    setOpen((isOpen) => !isOpen);
  };

  const handleSelect = (iso) => {
    if (!rangeMode) {
      setDraftStart(iso);
      setDraftEnd("");
      return;
    }

    const clickedDate = parseISO(iso);

    if (!draftStart || draftEnd) {
      setDraftStart(iso);
      setDraftEnd("");
      return;
    }

    if (clickedDate < parseISO(draftStart)) {
      setDraftStart(iso);
      setDraftEnd("");
      return;
    }

    setDraftEnd(iso);
  };

  const handleApply = () => {
    onApplyDates({
      departure_date: draftStart,
      return_date: rangeMode ? draftEnd : "",
    });
    setOpen(false);
  };

  const handleClear = () => {
    setDraftStart("");
    setDraftEnd("");
    onClearDates();
  };

  const displayValue = value
    ? parseISO(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div ref={wrapRef} className="dp-wrap">
      <button
        id={id}
        type="button"
        className={`dp-trigger${!displayValue ? " dp-trigger--empty" : ""}`}
        onClick={openPicker}
      >
        <CalendarIcon />
        <span>{displayValue ?? "Add date"}</span>
      </button>

      {open && (
        <div className="dp-popover" role="dialog" aria-label={`Select ${label}`}>
          <div className="dp-popover-inner">
            <button
              type="button"
              className="dp-nav dp-nav--prev"
              onClick={() => {
                const previous = shiftMonth(viewYear, viewMonth, -1);
                setViewYear(previous.year);
                setViewMonth(previous.month);
              }}
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className="dp-months">
              <MonthGrid
                year={viewYear}
                month={viewMonth}
                selected={selectedDate}
                rangeStart={draftStartDate}
                rangeEnd={draftEndDate}
                minDate={minDateObj}
                onSelect={handleSelect}
              />
              <MonthGrid
                year={nextMonth.year}
                month={nextMonth.month}
                selected={selectedDate}
                rangeStart={draftStartDate}
                rangeEnd={draftEndDate}
                minDate={minDateObj}
                onSelect={handleSelect}
              />
            </div>

            <button
              type="button"
              className="dp-nav dp-nav--next"
              onClick={() => {
                const next = shiftMonth(viewYear, viewMonth, 1);
                setViewYear(next.year);
                setViewMonth(next.month);
              }}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="dp-footer">
            <button type="button" className="dp-clear" onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="dp-apply" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
