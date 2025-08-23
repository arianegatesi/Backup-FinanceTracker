import React, { useState } from 'react';
import { Search } from 'lucide-react';

const GlobalSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    const searchRequest = {
    term: searchTerm,
    entityType: 'transaction'
     };
    
    
     try {
     const response = await fetch('http://localhost:8080/search', {
     method: 'POST',
     headers: {
     'Content-Type': 'application/json',
     },
     body: JSON.stringify(searchRequest)
     });
    
    
     if (response.ok) {
     const data = await response.json();
     onSearch(data);
     }
     } catch (error) {
    console.error('Search failed:', error);
    }
   };


  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search what you need..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Search
      </button>
    </div>
  );
};

export default GlobalSearch;
