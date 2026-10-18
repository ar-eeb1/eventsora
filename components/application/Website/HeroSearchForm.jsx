"use client"
import { Search } from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react'
import useFetch from "@/hooks/useFetch";
import { useRouter } from 'next/navigation';
import { WEBSITE_LISTING } from "@/routes/WebsiteRoute";

const HeroSearchForm = () => {
    const router = useRouter();
    const { data: cityData } = useFetch('/api/website/location/city');
    const cities = useMemo(() => cityData?.data || [], [cityData]);

    const [searchQuery, setSearchQuery] = useState("");
    const [locationName, setLocationName] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const wrapperRef = useRef(null);

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

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) queryParams.set("q", searchQuery.trim());
        if (selectedCityId) queryParams.set("city", selectedCityId);

        const url = `${WEBSITE_LISTING}?${queryParams.toString()}`;
        router.push(url);
    };

    const filteredCities = useMemo(() => {
        if (!locationName) return cities;
        return cities.filter(c => c.city.toLowerCase().includes(locationName.toLowerCase()));
    }, [cities, locationName]);

    const handleLocationChange = (e) => {
        setLocationName(e.target.value);
        setSelectedCityId(null);
        setShowSuggestions(true);
    };

    const handleSelectCity = (city) => {
        setLocationName(city.city);
        setSelectedCityId(city._id);
        setShowSuggestions(false);
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white p-2 rounded-full shadow-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-2 hover:shadow-pink-900/10 transition-all duration-300">
            {/* Search Query Input */}
            <div className="flex-1 w-full flex flex-col justify-center px-6 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-gray-100 min-h-[60px]">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 cursor-text">Looking for</label>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Venues, Photographers..." 
                    className="w-full bg-transparent border-none outline-none text-gray-900 font-medium placeholder:text-gray-300 focus:ring-0 p-0 text-sm md:text-base"
                />
            </div>

            {/* Location Input */}
            <div className="flex-1 w-full flex flex-col justify-center px-6 py-3 sm:py-0 min-h-[60px] relative" ref={wrapperRef}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 cursor-text">Location</label>
                <input 
                    type="text" 
                    value={locationName}
                    onChange={handleLocationChange}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Anywhere in Pakistan" 
                    className="w-full bg-transparent border-none outline-none text-gray-900 font-medium placeholder:text-gray-300 focus:ring-0 p-0 text-sm md:text-base"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredCities.length > 0 && (
                    <ul className="absolute left-0 top-[110%] w-[calc(100%+2rem)] -ml-4 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto py-2">
                        {filteredCities.map((city) => (
                            <li
                                key={city._id}
                                className="px-6 py-3 hover:bg-pink-50 hover:text-pink-900 cursor-pointer text-sm font-medium transition-colors"
                                onClick={() => handleSelectCity(city)}
                            >
                                {city.city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Search Button */}
            <button type="submit" className="w-full sm:w-auto h-full min-h-[60px] bg-pink-900 hover:bg-pink-800 text-white px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Search className="w-5 h-5" />
                <span className="font-bold">Search</span>
            </button>
        </form>
    )
}

export default HeroSearchForm
