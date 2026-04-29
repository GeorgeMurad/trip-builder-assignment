# Trip Builder

Trip Builder is a full-stack flight search application developed as a technical assignment, supporting one-way and round-trip planning with features such as airport autocomplete, airline filtering, sorting, server-side pagination, passenger-based pricing, and date validation, powered by seeded MySQL data for consistent local testing.

## Live Demo

Frontend:
https://trip-builder-assignment.vercel.app

Backend API:
https://trip-builder-assignment.onrender.com/api

The application is fully deployed. The frontend communicates with a live Laravel API hosted on Render.

## Quick Start

1. Start MySQL and create a local database for the project.
2. Install and run the Laravel API from `trip-builder`.
3. Install and run the React app from `trip-builder-frontend`.
4. Open the Vite app at `http://localhost:5173`; the API runs at `http://127.0.0.1:8000`.

## Architecture

- `trip-builder`: Laravel PHP API (Dockerized, hosted on Render)
- `trip-builder-frontend`: React single-page application (hosted on Vercel)
- Database:
  - SQLite (production, auto-migrated and seeded on startup)
  - MySQL (optional for local development)
## Requirements

- PHP
- Composer
- MySQL
- Node.js
- npm

## Backend Setup

From the repository root:

```bash
cd trip-builder
composer install
cp .env.example .env
```

Configure the MySQL connection in `trip-builder/.env` before running migrations. Example local values:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=trip_builder
DB_USERNAME=root
DB_PASSWORD=
```

Create the database using the configured database name, then run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

By default, the API runs at `http://127.0.0.1:8000`.

Run the automated backend feature tests with:

```bash
php artisan test
```

## Frontend Setup

From the repository root:

```bash
cd trip-builder-frontend
npm install
npm run dev
```

By default, the Vite development server runs at `http://localhost:5173`.

## Project Structure

- `trip-builder`: Laravel API, request validation, controllers, services, migrations, and seeders.
- `trip-builder-frontend`: React/Vite client application, search form, autocomplete components, results UI, and API client.
- `TEST_PLAN.md`: Manual test coverage for the main user flows and API behavior.

## Features Implemented

- One-way trips
- Round-trip trips
- Airport autocomplete using airport code, city, city code, and airport name
- Preferred airline filter
- Sorting
- Server-side pagination
- Adults and children passenger counts
- Dynamic total price based on passenger count
- Date validation: departure date must be from today to today + 365 days
- MySQL seed data including the provided sample data
- Laravel feature tests for trip search, filtering, sorting, pagination, and validation

## Extra Considerations

Implemented extras:

- Scales beyond sample data with additional seeded airlines, airports, and flights.
- Uses MySQL-backed Laravel migrations and seeders for relational data storage.
- Includes automated Laravel feature tests for the implemented search API behavior.
- Documents the web service endpoints, query parameters, and sample requests below.
- Allows searches to be restricted to a preferred airline.
- Supports trip listing sorting by price, departure time, and duration.
- Supports server-side trip listing pagination.

Partial extras:

- Online deployment: the frontend is deployed at `https://trip-builder-assignment.vercel.app`, but The backend API runs locally by default. A public API can be configured by updating the frontend API base URL.
- Multi-city trips: the database schema includes trip and ordered trip-flight tables, but there is no user-facing API or frontend flow for multi-city search.

## Design Decisions

- Laravel was used for the backend because it provides a structured API layer, request validation, migrations, seeders, and clear separation between controllers and business logic.
- React was used for the frontend because the trip search UI benefits from reusable components, local interaction state, and fast iteration with Vite.
- MySQL was used because the assignment data is relational and works naturally with Laravel migrations, Eloquent models, and seeded test data.
- Server-side pagination keeps API responses small and predictable as the number of available trips grows.
- Seeded data makes the project easy to review, test, and reset without relying on external services.

## API Base URLs

Production:
https://trip-builder-assignment.onrender.com/api

Local development:
http://127.0.0.1:8000/api

## Deployment Overview

- Frontend deployed on Vercel
- Backend deployed on Render using Docker
- API connected via HTTPS (no localhost dependencies)
- Database initialized automatically on container start

This setup ensures the project can be reviewed without any local setup.

### GET /api/airports

Returns airport suggestions for autocomplete.

Query parameters:

- `q`: Optional search text. Matches airport code, city, city code, or airport name.

Sample request:

```text
GET /api/airports?q=YUL
```

### GET /api/trips/one-way

Returns matching one-way trip options.

Query parameters:

- `from`: Required departure airport code.
- `to`: Required arrival airport code.
- `departure_date`: Required departure date in `YYYY-MM-DD` format.
- `preferred_airline`: Optional airline code filter.
- `sort_by`: Optional sort value: `price_asc`, `price_desc`, `departure_asc`, `departure_desc`, or `duration_asc`.
- `page`: Optional page number.
- `limit`: Optional results per page.
- `adults`: Optional adult passenger count.
- `children`: Optional child passenger count.

Sample request:

```text
GET /api/trips/one-way?from=YUL&to=YVR&departure_date=2026-05-20&preferred_airline=AC&sort_by=price_asc&page=1&limit=3&adults=2&children=1
```

### GET /api/trips/round-trip

Returns matching round-trip combinations.

Query parameters:

- `from`: Required departure airport code.
- `to`: Required arrival airport code.
- `departure_date`: Required departure date in `YYYY-MM-DD` format.
- `return_date`: Required return date in `YYYY-MM-DD` format.
- `preferred_airline`: Optional airline code filter.
- `sort_by`: Optional sort value: `price_asc`, `price_desc`, `departure_asc`, `departure_desc`, or `duration_asc`.
- `page`: Optional page number.
- `limit`: Optional results per page.
- `adults`: Optional adult passenger count.
- `children`: Optional child passenger count.

Sample request:

```text
GET /api/trips/round-trip?from=YUL&to=YVR&departure_date=2026-05-20&return_date=2026-05-27&preferred_airline=AC&sort_by=duration_asc&page=1&limit=3&adults=2&children=0
```

## Notes

- Flight times are stored as local airport times.
- Airport timezones are stored in the database.
- Open-jaw and vicinity search are not implemented.
- Multi-city search is represented only by schema primitives and is not available through the API or UI.
