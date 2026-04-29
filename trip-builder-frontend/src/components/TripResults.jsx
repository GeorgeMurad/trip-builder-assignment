function formatTime(time) {
  if (!time) {
    return "N/A";
  }

  return time.split(":").slice(0, 2).join(":");
}

function getDuration(dep, arr) {
  if (!dep || !arr) {
    return "N/A";
  }

  const [h1, m1] = dep.split(":").map(Number);
  const [h2, m2] = arr.split(":").map(Number);

  if ([h1, m1, h2, m2].some(Number.isNaN)) {
    return "N/A";
  }

  const start = h1 * 60 + m1;
  let end = h2 * 60 + m2;

  if (end < start) {
    end += 24 * 60;
  }

  const diff = end - start;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
}

function getAirlineInfo(flight) {
  const airline = flight?.airline;
  const name =
    airline?.name ??
    flight?.airline_name ??
    flight?.carrier_name ??
    (typeof airline === "string" ? airline : "");
  const code =
    airline?.code ??
    airline?.iata_code ??
    flight?.airline_code ??
    flight?.carrier_code ??
    flight?.airline_iata ??
    "";

  if (!name && !code) {
    return "Airline unavailable";
  }

  if (name && code) {
    return `${name} (${code})`;
  }

  return name || code;
}

function getRoute(flight) {
  return `${flight?.departure_airport ?? "N/A"} → ${
    flight?.arrival_airport ?? "N/A"
  }`;
}

function formatPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "$N/A";
  }

  if (typeof price === "number") {
    return `$${price.toFixed(2)}`;
  }

  return price.startsWith("$") ? price : `$${price}`;
}

function FlightDetails({ flight, label }) {
  if (!flight) {
    return null;
  }

  const departureTime = formatTime(flight.departure_time);
  const arrivalTime = formatTime(flight.arrival_time);
  const duration = getDuration(flight.departure_time, flight.arrival_time);

  return (
    <div className="flight-segment">
      <div className="flight-segment-topline">
        {label && <p className="flight-label">{label}</p>}
        <p className="flight-airline">{getAirlineInfo(flight)}</p>
      </div>
      <p className="flight-route">
        {getRoute(flight)}
      </p>
      <div className="flight-times" aria-label="Flight times">
        <div>
          <span>Depart</span>
          <strong>{departureTime}</strong>
        </div>
        <div>
          <span>Arrive</span>
          <strong>{arrivalTime}</strong>
        </div>
      </div>
      <p className="flight-duration">
        {flight.flight_number ?? "Flight"} • {duration}
      </p>
    </div>
  );
}

function formatCabinClass(cabinClass) {
  if (!cabinClass) {
    return "Economy";
  }

  return cabinClass
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPassengerSummary(adults = 1, children = 0) {
  const adultCount = Number(adults) || 1;
  const childCount = Number(children) || 0;
  const adultLabel = `${adultCount} ${adultCount === 1 ? "Adult" : "Adults"}`;

  if (childCount === 0) {
    return adultLabel;
  }

  return `${adultLabel}, ${childCount} ${
    childCount === 1 ? "Child" : "Children"
  }`;
}

function getPaginationItems(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page]);

  if (page > 1) {
    pages.add(page - 1);
  }

  if (page < totalPages) {
    pages.add(page + 1);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items = [];

  sortedPages.forEach((item, index) => {
    const previousItem = sortedPages[index - 1];

    if (previousItem && item - previousItem > 1) {
      items.push(`ellipsis-${previousItem}-${item}`);
    }

    items.push(item);
  });

  return items;
}

function TripResults({
  results,
  adults = 1,
  children = 0,
  cabinClass = "economy",
  pagination,
  isPaginating = false,
  onPageChange,
}) {
  if (!results) {
    return null;
  }

  if (results.length === 0) {
    return (
      <section className="results-section">
        <div className="empty-results">
          <h2>No flights found</h2>
          <p>Try changing your dates, route, or airline preference.</p>
        </div>
      </section>
    );
  }

  const {
    totalTrips = 0,
    returnedTrips = results.length,
    page = 1,
    totalPages = 1,
  } = pagination ?? {};
  const paginationItems = getPaginationItems(page, totalPages);

  return (
    <section className="results-section">
      <div className="results-heading">
        <h2>Results</h2>
        <p>
          {formatPassengerSummary(adults, children)} •{" "}
          {formatCabinClass(cabinClass)}
        </p>
      </div>
      <p className="results-summary">
        Showing {returnedTrips} of {totalTrips} trips
      </p>

      <div className="results-list">
        {results.map((result, index) => {
          const isRoundTrip = result?.outbound && result?.return;
          const price = isRoundTrip ? result.total_price : result?.price;
          const duration = isRoundTrip
            ? "Round trip"
            : getDuration(result?.departure_time, result?.arrival_time);

          return (
            <article className="flight-card" key={index}>
              <div className="flight-details">
                {isRoundTrip ? (
                  <>
                    <FlightDetails flight={result.outbound} label="Outbound" />
                    <div className="flight-segment-divider" />
                    <FlightDetails flight={result.return} label="Return" />
                  </>
                ) : (
                  <FlightDetails flight={result} />
                )}
              </div>
              <div className="flight-card-footer">
                <p className="flight-total-duration">{duration}</p>
                <p className="flight-price">
                  {isRoundTrip && <span>Total</span>}
                  {formatPrice(price)}
                </p>
                <button type="button" className="flight-select-button">
                  Select
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className="pagination-controls" aria-label="Results pagination">
          <button
            type="button"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1 || isPaginating}
          >
            Previous
          </button>

          {paginationItems.map((item) =>
            typeof item === "string" ? (
              <span className="pagination-ellipsis" key={item}>
                ...
              </span>
            ) : (
              <button
                type="button"
                className={item === page ? "active" : ""}
                key={item}
                onClick={() => onPageChange?.(item)}
                disabled={item === page || isPaginating}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages || isPaginating}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

export default TripResults;
