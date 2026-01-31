"use client";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_CATEGORY, WEBSITE_LISTING } from "@/routes/WebsiteRoute";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { IoSearchOutline, IoLocationOutline } from "react-icons/io5";

const Search = ({ isShow, onClose }) => {
  const params = useParams();
  const webLabel = params.category;
  const router = useRouter();

  const { data: cityData } = useFetch('/api/website/location/city');
  const cities = useMemo(() => cityData?.data || [], [cityData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationName, setLocationName] = useState(""); // Display text
  const [selectedCityId, setSelectedCityId] = useState(null); // Actual ID for API

  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Close Search Component on click outside
  useEffect(() => {
    if (!isShow) return;
    function handleClickOutsideSearch(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, [isShow, onClose, searchContainerRef]);


  const handleSearch = (e) => {
    e.preventDefault();

    // Construct URL with available params
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set("q", searchQuery.trim());
    if (selectedCityId) queryParams.set("city", selectedCityId);

    // Determine base route
    const baseUrl = webLabel ? WEBSITE_CATEGORY(webLabel) : WEBSITE_LISTING;
    const url = `${baseUrl}?${queryParams.toString()}`;

    router.push(url);
  };

  const filteredCities = useMemo(() => {
    if (!locationName) return cities;
    // If the user hasn't selected a city yet (or is typing to change it), filter
    // If they JUST selected one, we might want to show all or keep filtering?
    // Let's filter by the current text input.
    return cities.filter(c => c.city.toLowerCase().includes(locationName.toLowerCase()));
  }, [cities, locationName]);

  const handleLocationChange = (e) => {
    setLocationName(e.target.value);
    setSelectedCityId(null); // Reset selection on manual type
    setShowSuggestions(true);
  };

  const handleSelectCity = (city) => {
    setLocationName(city.city);
    setSelectedCityId(city._id);
    setShowSuggestions(false);
  };

  return (
    <div
      ref={searchContainerRef}
      className={`absolute transition-all left-0 py-5 md:px-32 px-5 z-10 bg-[#CE416F] w-full ${isShow ? "top-18" : "-top-full"
        }`}
    >
      <form
        onSubmit={handleSearch}
        className="flex justify-between items-center relative gap-4"
      >
        {/* Location Input Wrapper */}
        <div className="relative w-1/4" ref={wrapperRef}>
          <div className="relative">
            <Input
              className="rounded-full md:h-12 ps-10 border-primary bg-white w-full"
              placeholder="Location..."
              value={locationName}
              onChange={handleLocationChange}
              onFocus={() => setShowSuggestions(true)}
            />
            <IoLocationOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredCities.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredCities.map((city) => (
                <li
                  key={city._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectCity(city)}
                >
                  {city.city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative flex-1">
          <Input
            className="rounded-full md:h-12 ps-5 border-primary bg-white w-full"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>


        <button
          type="submit"
          className="absolute right-3 cursor-pointer flex"
        >
          <IoSearchOutline size={20} className="text-gray-500" />
        </button>
      </form>
    </div>
  );
};

export default Search;
