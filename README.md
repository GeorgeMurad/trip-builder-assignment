# Trip Builder

## Overview

Trip Builder is a full-stack flight search assignment that supports one-way and round-trip trip planning. The application provides airport autocomplete, airline filtering, sorting, pagination, passenger-based pricing, and seeded MySQL data for repeatable local testing.

## Architecture

- Backend: Laravel PHP API
- Frontend: React SPA
- Database: MySQL

In this workspace, the backend folder is `trip-builder` and the frontend folder is `trip-builder-frontend`. If the submission is renamed to `backend` and `frontend`, use the commands below as written.

## Features Implemented

- One-way trips
- Round-trip trips
- Airport autocomplete using airport code, city, city_code, and airport name
- Preferred airline filter
- Sorting
- Pagination
- Adults and children passenger counts
- Dynamic total price based on passenger count
- Date validation: departure date must be from today to today + 365 days
- MySQL seed data including the provided sample data

## Requirements

- PHP
- Composer
- MySQL
- Node.js
- npm

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
```

Configure the MySQL database connection in `.env`, then run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

By default, the API runs at `http://127.0.0.1:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

By default, the Vite development server runs at `http://localhost:5173`.

## API Documentation

Base URL:

```text
http://127.0.0.1:8000/api
```

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
- Open-jaw, multi-city, and vicinity search are future enhancements.
