import { supabase } from "@/lib/supabaseClient";
import * as Tabs from "@radix-ui/react-tabs";
import { Search } from "lucide-react";
import { useState } from "react";

const ForumSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>([]);
  const [searchLoading, setSearchLoading] = useState<boolean | null>(false);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .ilike("title", `%${searchTerm}%`) // Search for titles containing the search term
        .or(`body.ilike.%${searchTerm}%`); // Search for body containing the search term

      if (error) {
        console.error("Error searching posts:", error);
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search the forum..."
          className="border border-gray-300 rounded-md px-4 py-2 w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Search />
        </button>
      </div>

      {searchLoading && <div>Loading...</div>}

      {searchResults !== null && (
        <div className="flex   h-full py-10">
          <p className="text-center">Your search results will appear here</p>
        </div>
      )}

      <div>
        {searchResults?.map((result) => (
          <div
            key={result?.id}
            className="border border-gray-300 rounded-md p-4 my-2"
          >
            <h3 className="font-bold">{result?.title}</h3>
            <p>{result?.body}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ForumSearch;
