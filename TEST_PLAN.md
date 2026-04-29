# Test Plan

This test plan covers manual verification for the Trip Builder Laravel API, React frontend, search behavior, validation, pricing, pagination, and seeded data.

## Prerequisites

- MySQL is running.
- Backend dependencies are installed.
- Frontend dependencies are installed.
- Database migrations and seeders have been run with `php artisan migrate --seed`.

## Manual Test Cases

### Backend API Running

1. Start the backend with `php artisan serve`.
2. Open `http://127.0.0.1:8000/api/airports?q=YUL`.
3. Verify the API returns a JSON response with airport data.

Expected result: the backend responds successfully and includes matching airport records.

### Frontend Running

1. Start the frontend with `npm run dev`.
2. Open the Vite URL in a browser.
3. Verify the Trip Builder search form loads without console errors.

Expected result: the frontend loads and displays the trip search interface.

### Airport Autocomplete

1. Type at least two characters into the From or To airport field.
2. Search by airport code, city, city code, and airport name.
3. Select a suggestion.

Expected result: matching airport suggestions appear and selecting one fills the airport code.

### One-Way Search

1. Select one-way trip type.
2. Enter valid From and To airport codes.
3. Enter a valid departure date within the next 365 days.
4. Submit the search.

Expected result: matching one-way trip results are displayed with flight details and prices.

### Round-Trip Search

1. Select round-trip trip type.
2. Enter valid From and To airport codes.
3. Enter a valid departure date and a return date after the departure date.
4. Submit the search.

Expected result: matching round-trip results are displayed with outbound and return flight details.

### Preferred Airline

1. Run a search with no preferred airline selected.
2. Run the same search with a preferred airline selected, such as `AC`.

Expected result: filtered results only include flights from the selected airline.

### Sorting

1. Run a search that returns multiple results.
2. Apply each supported sort option: lowest price, highest price, earliest departure, latest departure, and shortest duration.

Expected result: results are reordered according to the selected sort option.

### Pagination

1. Run a search with enough results for multiple pages.
2. Move between pages.
3. Verify the displayed result count and page metadata.

Expected result: each page shows the correct subset of results without changing the search filters.

### Invalid Dates

1. Submit a departure date before today.
2. Submit a departure date more than 365 days from today.
3. For round trips, submit a return date before or equal to the departure date.

Expected result: the request is rejected and validation feedback is shown.

### Missing Required Fields

1. Submit a search without `from`.
2. Submit a search without `to`.
3. Submit a search without the required departure date.

Expected result: the request is rejected and required field validation feedback is shown.

### No Results

1. Search for a valid airport pair with no seeded flights.
2. Submit the search.

Expected result: the UI displays an empty-state message and the API returns no trip results.

### Adults and Children Price Calculation

1. Run a search with `adults=1` and `children=0`.
2. Run the same search with multiple passengers, such as `adults=2` and `children=1`.
3. Compare the returned `total_price` values.

Expected result: total price is multiplied by the total passenger count.

### Database Seed Verification

1. Run `php artisan migrate:fresh --seed` in the backend.
2. Query the airports, airlines, and flights tables or call the search endpoints using known seeded routes.
3. Verify sample routes such as `YUL` to `YVR` and airlines such as `AC`, `WS`, `PD`, and `AF`.

Expected result: seeded airports, airlines, and flights are available for API and frontend searches.
