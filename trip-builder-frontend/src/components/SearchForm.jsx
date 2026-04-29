import { useState } from "react";
import AirportAutocomplete from "./AirportAutocomplete";
import DatePicker from "./DatePicker";
import PreferredAirlineAutocomplete from "./PreferredAirlineAutocomplete";

const initialFormData = {
  from: "",
  to: "",
  tripType: "one-way",
  departure_date: "",
  return_date: "",
  preferred_airline: "",
  sort_by: "",
  adults: 1,
  children: 0,
  cabin_class: "economy",
};

function SearchForm({ onSearch, apiError, isSearching = false }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);

  const validateForm = (data) => {
    const validationErrors = {};
    const departureDate = data.departure_date
      ? new Date(`${data.departure_date}T00:00:00`)
      : null;
    const returnDate = data.return_date
      ? new Date(`${data.return_date}T00:00:00`)
      : null;

    if (!data.from.trim()) {
      validationErrors.from = "This field is required";
    }

    if (!data.to.trim()) {
      validationErrors.to = "This field is required";
    }

    if (!data.departure_date) {
      validationErrors.departure_date = "This field is required";
    } else if (Number.isNaN(departureDate.getTime())) {
      validationErrors.departure_date = "Enter a valid departure date";
    }

    if (data.tripType === "round-trip" && !data.return_date) {
      validationErrors.return_date = "This field is required";
    } else if (
      data.tripType === "round-trip" &&
      Number.isNaN(returnDate.getTime())
    ) {
      validationErrors.return_date = "Enter a valid return date";
    } else if (
      data.tripType === "round-trip" &&
      departureDate &&
      returnDate &&
      returnDate < departureDate
    ) {
      validationErrors.return_date = "Return date must be after departure date";
    }

    return validationErrors;
  };

  const focusFirstInvalidField = (validationErrors) => {
    const firstInvalidField = [
      "from",
      "to",
      "departure_date",
      "return_date",
    ].find((fieldName) => validationErrors[fieldName]);

    if (!firstInvalidField) {
      return;
    }

    requestAnimationFrame(() => {
      const field = document.getElementById(firstInvalidField);
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      field?.focus({ preventScroll: true });
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "adults") {
      nextValue = Math.min(9, Math.max(1, Number(value)));
    }

    if (name === "children") {
      nextValue = Math.min(9, Math.max(0, Number(value)));
    }

    const nextFormData = {
      ...formData,
      [name]: nextValue,
    };
    const nextErrors = validateForm(nextFormData);

    setFormData(nextFormData);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: nextErrors[name] ?? "",
    }));

    if (
      name === "sort_by" &&
      Object.keys(nextErrors).length === 0 &&
      !isSearching
    ) {
      onSearch(nextFormData);
    }
  };

  const handleTripTypeChange = (tripType) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      tripType,
      ...(tripType === "one-way" ? { return_date: "" } : {}),
    }));

    if (tripType === "one-way") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        return_date: "",
      }));
    }
  };

  const handleSwapRoute = () => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      from: currentFormData.to,
      to: currentFormData.from,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      from: "",
      to: "",
    }));
  };

  const handleDateApply = ({ departure_date, return_date }) => {
    const nextFormData = {
      ...formData,
      departure_date,
      return_date: formData.tripType === "round-trip" ? return_date : "",
    };

    const nextErrors = validateForm(nextFormData);

    setFormData(nextFormData);
    setErrors((currentErrors) => ({
      ...currentErrors,
      departure_date: nextErrors.departure_date ?? "",
      return_date: nextErrors.return_date ?? "",
    }));
  };

  const handleDateClear = () => {
    const nextFormData = {
      ...formData,
      departure_date: "",
      return_date: "",
    };

    setFormData(nextFormData);
    setErrors((currentErrors) => ({
      ...currentErrors,
      departure_date: "",
      return_date: "",
    }));
  };

  const updateTravelerCount = (name, amount) => {
    setFormData((currentFormData) => {
      const min = name === "adults" ? 1 : 0;
      const currentValue = Number(currentFormData[name]) || min;

      return {
        ...currentFormData,
        [name]: Math.min(9, Math.max(min, currentValue + amount)),
      };
    });
  };

  const travelerSummary = `${formData.adults} ${
    Number(formData.adults) === 1 ? "Adult" : "Adults"
  }${
    Number(formData.children) > 0
      ? `, ${formData.children} ${
          Number(formData.children) === 1 ? "Child" : "Children"
        }`
      : ""
  }, ${formData.cabin_class.charAt(0).toUpperCase()}${formData.cabin_class.slice(
    1
  )}`;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSearching) {
      return;
    }

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstInvalidField(validationErrors);
      return;
    }

    setErrors({});
    onSearch(formData);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="trip-toggle" aria-label="Trip type">
        <button
          type="button"
          aria-pressed={formData.tripType === "one-way"}
          className={formData.tripType === "one-way" ? "active" : ""}
          onClick={() => handleTripTypeChange("one-way")}
        >
          One-way
        </button>
        <button
          type="button"
          aria-pressed={formData.tripType === "round-trip"}
          className={formData.tripType === "round-trip" ? "active" : ""}
          onClick={() => handleTripTypeChange("round-trip")}
        >
          Round-trip
        </button>
      </div>

      <div
        className={`flight-search-row ${
          formData.tripType === "round-trip" ? "round-trip" : "one-way"
        }`}
      >
        <div
          className={`form-field search-cell route-field route-from${
            errors.from ? " has-error" : ""
          }`}
        >
          <label htmlFor="from">From</label>
          <AirportAutocomplete
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            invalid={Boolean(errors.from)}
            placeholder="City, country, or airport"
          />
          {errors.from && <p className="field-error">{errors.from}</p>}
        </div>

        <div className="search-cell route-swap-cell">
          <button
            type="button"
            className="route-swap-button"
            onClick={handleSwapRoute}
            aria-label="Swap departure and destination"
            title="Swap route"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 7h12" />
              <path d="M15 3l4 4-4 4" />
              <path d="M17 17H5" />
              <path d="M9 21l-4-4 4-4" />
            </svg>
          </button>
        </div>

        <div
          className={`form-field search-cell route-field route-to${
            errors.to ? " has-error" : ""
          }`}
        >
          <label htmlFor="to">To</label>
          <AirportAutocomplete
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            invalid={Boolean(errors.to)}
            placeholder="City, country, or airport"
          />
          {errors.to && <p className="field-error">{errors.to}</p>}
        </div>

        <div className={`form-field search-cell${errors.departure_date ? " has-error" : ""}`}>
          <label htmlFor="departure_date">Departure date</label>
          <DatePicker
            id="departure_date"
            name="departure_date"
            label="departure date"
            value={formData.departure_date}
            rangeStart={formData.departure_date || undefined}
            rangeEnd={formData.tripType === "round-trip" ? formData.return_date || undefined : undefined}
            rangeMode={formData.tripType === "round-trip"}
            onApplyDates={handleDateApply}
            onClearDates={handleDateClear}
          />
          {errors.departure_date && (
            <p className="field-error">{errors.departure_date}</p>
          )}
        </div>

        {formData.tripType === "round-trip" && (
          <div className={`form-field search-cell${errors.return_date ? " has-error" : ""}`}>
            <label htmlFor="return_date">Return date</label>
            <DatePicker
              id="return_date"
              name="return_date"
              label="return date"
              value={formData.return_date}
              rangeStart={formData.departure_date || undefined}
              rangeEnd={formData.return_date || undefined}
              rangeMode
              onApplyDates={handleDateApply}
              onClearDates={handleDateClear}
            />
            {errors.return_date && (
              <p className="field-error">{errors.return_date}</p>
            )}
          </div>
        )}

        <div className="form-field search-cell travelers-field">
          <label>Travelers and cabin class</label>
          <button
            type="button"
            className="travelers-trigger"
            onClick={() => setIsTravelersOpen((isOpen) => !isOpen)}
          >
            {travelerSummary}
          </button>

          {isTravelersOpen && (
            <div className="travelers-popover">
              <div>
                <h3>Cabin class</h3>
                <select
                  id="cabin_class"
                  name="cabin_class"
                  value={formData.cabin_class}
                  onChange={handleChange}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium</option>
                  <option value="business">Business</option>
                  <option value="first">First</option>
                </select>
              </div>

              <div className="traveler-counter">
                <div>
                  <strong>Adults</strong>
                  <span>Aged 18+</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    onClick={() => updateTravelerCount("adults", -1)}
                    disabled={Number(formData.adults) <= 1}
                  >
                    -
                  </button>
                  <span>{formData.adults}</span>
                  <button
                    type="button"
                    onClick={() => updateTravelerCount("adults", 1)}
                    disabled={Number(formData.adults) >= 9}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="traveler-counter">
                <div>
                  <strong>Children</strong>
                  <span>Aged 0-17</span>
                </div>
                <div className="counter-controls">
                  <button
                    type="button"
                    onClick={() => updateTravelerCount("children", -1)}
                    disabled={Number(formData.children) <= 0}
                  >
                    -
                  </button>
                  <span>{formData.children}</span>
                  <button
                    type="button"
                    onClick={() => updateTravelerCount("children", 1)}
                    disabled={Number(formData.children) >= 9}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="travelers-apply"
                onClick={() => setIsTravelersOpen(false)}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            className="search-button"
            type="submit"
            disabled={isSearching}
            aria-busy={isSearching}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>{isSearching ? "Searching" : "Search"}</span>
          </button>
        </div>
      </div>

      <div className="form-secondary-row">
        <div className="form-field">
          <label htmlFor="preferred_airline">Preferred airline</label>
          <PreferredAirlineAutocomplete
            id="preferred_airline"
            name="preferred_airline"
            value={formData.preferred_airline}
            onChange={handleChange}
            placeholder="Any airline"
          />
        </div>

        <div className="form-field">
          <label htmlFor="sort_by">Sort by</label>
          <select
            id="sort_by"
            name="sort_by"
            value={formData.sort_by}
            onChange={handleChange}
          >
            <option value="">Default</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="departure_asc">Departure (Earliest)</option>
            <option value="departure_desc">Departure (Latest)</option>
            <option value="duration_asc">Duration (Shortest)</option>
          </select>
        </div>
      </div>

      {apiError && <p className="form-error">{apiError}</p>}
    </form>
  );
}

export default SearchForm;
