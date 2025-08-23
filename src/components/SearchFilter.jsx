import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ onSearch, filters }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
     
      
      {filters.map((filter) => (
        <select
          key={filter.key}
          onChange={(e) => filter.onChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default SearchFilter;