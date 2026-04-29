import { useRef, useState } from "react";
import SearchForm from "../components/SearchForm";
import TripResults from "../components/TripResults";
import tripBuilderLogo from "../assets/trip-builder-logo.png";
import heroBg from "../assets/hero-bg.png";
import { searchOneWay, searchRoundTrip } from "../services/api";

const RESULTS_PER_PAGE = 3;
const initialPagination = {
  totalTrips: 0,
  returnedTrips: 0,
  page: 1,
  totalPages: 1,
  minPrice: null,
  maxPrice: null,
};

function Home() {
  const [results, setResults] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [pagination, setPagination] = useState(initialPagination);
  const [isSearching, setIsSearching] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const [formError, setFormError] = useState("");
  const resultsRef = useRef(null);

  const handleSearch = async (formData, page = 1, { paginate = false } = {}) => {
    const requestPage = paginate ? page : 1;

    try {
      setFormError("");
      setIsSearching(!paginate);
      setIsPaginating(paginate);

      const search =
        formData.tripType === "one-way" ? searchOneWay : searchRoundTrip;

      const data = await search({
        ...formData,
        page: requestPage,
        limit: RESULTS_PER_PAGE,
      });
      const flights = Array.isArray(data) ? data : data.data;
      const nextFlights = flights ?? [];
      const nextPage = data.page ?? data.current_page ?? data.meta?.current_page ?? requestPage;
      const nextTotalPages =
        data.totalPages ?? data.last_page ?? data.meta?.last_page ?? nextPage;

      setResults(nextFlights);
      setSearchParams(formData);
      setPagination({
        totalTrips: data.totalTrips ?? data.total ?? nextFlights.length,
        returnedTrips: data.returnedTrips ?? nextFlights.length,
        page: nextPage,
        totalPages: nextTotalPages,
        minPrice: data.minPrice ?? null,
        maxPrice: data.maxPrice ?? null,
      });

      if (nextFlights.length > 0) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      const backendErrors = err.errors
        ? Object.values(err.errors).flat().join(" ")
        : "";

      setFormError(backendErrors || err.message || "Unable to search flights.");
      setResults([]);
      setPagination(initialPagination);
    } finally {
      setIsSearching(false);
      setIsPaginating(false);
    }
  };

  const handlePageChange = (page) => {
    if (
      !searchParams ||
      page === pagination.page ||
      page < 1 ||
      page > pagination.totalPages
    ) {
      return;
    }

    handleSearch(searchParams, page, { paginate: true });
  };

  return (
    <main className="app-shell">
      <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <img
            className="brand-logo"
            src={tripBuilderLogo}
            alt="Trip Builder"
          />
          <h1>Search flights. Save big.</h1>
          <p>Search one-way and round-trip flights and save.</p>
        </div>
      </section>

      <div className="search-card-wrap">
        <div className="search-card" aria-label="Flight search">
          <SearchForm
            onSearch={handleSearch}
            apiError={formError}
            isSearching={isSearching}
          />
        </div>
      </div>

      <div ref={resultsRef}>
        <TripResults
          results={results}
          adults={searchParams?.adults}
          children={searchParams?.children}
          cabinClass={searchParams?.cabin_class}
          pagination={pagination}
          isPaginating={isPaginating}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}

export default Home;