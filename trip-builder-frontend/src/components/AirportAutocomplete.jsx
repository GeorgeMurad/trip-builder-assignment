import { useState, useEffect, useRef } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

function AirportAutocomplete({ id, name, value, onChange, invalid, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = (q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (q.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/airports?q=${encodeURIComponent(q)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data ?? [];
        setSuggestions(list);
        setIsOpen(list.length > 0);
      } catch {
        // network error — silently ignore
      }
    }, 300);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    fetchSuggestions(val);
    // Propagate raw text while the user is still typing
    onChange({ target: { name, value: val } });
  };

  const handleSelect = (airport) => {
    const code = airport.iata_code ?? airport.code ?? "";
    setSuggestions([]);
    setIsOpen(false);
    onChange({ target: { name, value: code } });
  };

  const formatMeta = (airport) => {
    const city = airport.municipality ?? airport.city ?? "";
    const cityCode = airport.city_code ?? "";
    const code = airport.iata_code ?? airport.code ?? "";
    return [city, cityCode ? `(${cityCode})` : "", code ? `— ${code}` : ""]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div ref={containerRef} className="autocomplete-wrap">
      <input
        id={id}
        name={name}
        type="text"
        autoComplete="off"
        className={invalid ? "input-error" : ""}
        aria-invalid={invalid ? "true" : "false"}
        placeholder={placeholder}
        value={value || ""}
        onChange={handleInputChange}
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown" role="listbox">
          {suggestions.map((airport, index) => {
            const code = airport.iata_code ?? airport.code ?? index;
            const airportName = airport.name ?? "";
            return (
              <li
                key={code}
                role="option"
                className="autocomplete-item"
                onMouseDown={() => handleSelect(airport)}
              >
                <span className="autocomplete-airport-name">{airportName}</span>
                <span className="autocomplete-airport-meta">
                  {formatMeta(airport)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AirportAutocomplete;
