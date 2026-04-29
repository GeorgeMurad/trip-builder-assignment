import { useEffect, useMemo, useRef, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

function getAirlineCode(airline) {
  return airline?.code ?? airline?.iata_code ?? "";
}

function getAirlineName(airline) {
  return airline?.name ?? airline?.airline_name ?? "";
}

function PreferredAirlineAutocomplete({
  id,
  name,
  value,
  onChange,
  placeholder = "Any airline",
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      return;
    }

    const controller = new AbortController();

    const debounceTimer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${BASE_URL}/airlines?search=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setResults([]);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data ?? [];
        setResults(list);
        setShowDropdown(true);
        setActiveIndex(list.length > 0 ? 0 : -1);
      } catch (error) {
        if (error.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [query]);

  const displayValue = useMemo(() => {
    if (!value || !selectedAirline) {
      return query;
    }
    const selectedName = getAirlineName(selectedAirline);
    const selectedCode = getAirlineCode(selectedAirline);
    return selectedName && selectedCode
      ? `${selectedName} (${selectedCode})`
      : selectedName || selectedCode;
  }, [query, selectedAirline, value]);

  const commitSelection = (airline) => {
    const airlineCode = getAirlineCode(airline);
    if (!airlineCode) {
      return;
    }
    setSelectedAirline(airline);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    onChange({ target: { name, value: airlineCode } });
  };

  const clearSelection = () => {
    setSelectedAirline(null);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    onChange({ target: { name, value: "" } });
  };

  const handleInputChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setSelectedAirline(null);
    setResults([]);
    setIsLoading(nextQuery.length > 0);
    setActiveIndex(-1);
    setShowDropdown(true);
    onChange({ target: { name, value: "" } });
  };

  const handleKeyDown = (event) => {
    if (!showDropdown || results.length === 0) {
      if (event.key === "Escape") {
        setShowDropdown(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        commitSelection(results[activeIndex]);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowDropdown(false);
    }
  };

  return (
    <div ref={wrapRef} className="preferred-airline-wrap">
      <input
        id={id}
        name={name}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (results.length > 0 || query.length > 0) {
            setShowDropdown(true);
          }
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={showDropdown ? "true" : "false"}
        aria-autocomplete="list"
      />

      {value && (
        <button
          type="button"
          className="preferred-airline-clear"
          onClick={clearSelection}
          aria-label="Clear preferred airline"
        >
          ×
        </button>
      )}

      {showDropdown && (
        <ul className="preferred-airline-dropdown" role="listbox">
          {isLoading && (
            <li className="preferred-airline-item preferred-airline-item--empty">
              Loading airlines...
            </li>
          )}

          {!isLoading && results.length === 0 && query.length > 0 && (
            <li className="preferred-airline-item preferred-airline-item--empty">
              No results found
            </li>
          )}

          {!isLoading &&
            results.map((airline, index) => {
              const airlineCode = getAirlineCode(airline) || index;
              const airlineName = getAirlineName(airline);
              const isActive = index === activeIndex;
              return (
                <li
                  key={airlineCode}
                  className={`preferred-airline-item${
                    isActive ? " preferred-airline-item--active" : ""
                  }`}
                  role="option"
                  aria-selected={isActive ? "true" : "false"}
                  onMouseDown={() => commitSelection(airline)}
                >
                  {airlineName} ({getAirlineCode(airline)})
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

export default PreferredAirlineAutocomplete;
