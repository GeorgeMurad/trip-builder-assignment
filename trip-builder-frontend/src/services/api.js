const BASE_URL = "https://trip-builder-assignment.onrender.com/api";

function buildQuery(params) {
  const filtered = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  return new URLSearchParams(filtered).toString();
}

async function handleResponse(res, fallbackMessage) {
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || fallbackMessage);
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export async function searchOneWay(params) {
  const query = buildQuery({
    from: params.from,
    to: params.to,
    departure_date: params.departure_date,
    sort_by: params.sort_by,
    preferred_airline: params.preferred_airline,
    adults: params.adults,
    children: params.children,
    cabin_class: params.cabin_class,
    page: params.page ?? 1,
    limit: params.limit,
  });

  const res = await fetch(`${BASE_URL}/trips/one-way?${query}`);

  return handleResponse(res, "Failed to fetch one-way trips");
}

export async function searchRoundTrip(params) {
  const query = buildQuery({
    from: params.from,
    to: params.to,
    departure_date: params.departure_date,
    return_date: params.return_date,
    sort_by: params.sort_by,
    preferred_airline: params.preferred_airline,
    adults: params.adults,
    children: params.children,
    cabin_class: params.cabin_class,
    page: params.page ?? 1,
    limit: params.limit,
  });

  const res = await fetch(`${BASE_URL}/trips/round-trip?${query}`);

  return handleResponse(res, "Failed to fetch round trips");
}

export async function searchAirports(query) {
  const params = buildQuery({ q: query });
  const res = await fetch(`${BASE_URL}/airports?${params}`);

  return handleResponse(res, "Failed to fetch airports");
}

export async function searchAirlines(query, options = {}) {
  const params = buildQuery({ search: query });
  const res = await fetch(`${BASE_URL}/airlines?${params}`, {
    signal: options.signal,
  });

  return handleResponse(res, "Failed to fetch airlines");
}