"use client";
import { Input } from "@/components/ui/input";
import { WEBSITE_CATEGORY } from "@/routes/WebsiteRoute";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const Search = ({ isShow }) => {
  const params = useParams();
  const webLabel = params.category;
  const router = useRouter();

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query?.trim()) return;

    router.push(`${WEBSITE_CATEGORY(webLabel)}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div
      className={`absolute transition-all left-0 py-5 md:px-32 px-5 z-10 bg-[#CE416F] w-full ${
        isShow ? "top-18" : "-top-full"
      }`}
    >
      <form
        onSubmit={handleSearch}
        className="flex justify-between items-center relative"
      >
        <Input
          className="rounded-full md:h-12 ps-5 border-primary bg-white"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="submit"
          className="absolute right-3 cursor-pointer"
        >
          <IoSearchOutline size={20} className="text-gray-500" />
        </button>
      </form>
    </div>
  );
};

export default Search;
