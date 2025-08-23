import React from 'react';

const FeatureCard = ({ title, description, Icon }) => {
  return (
    <div className="relative p-6 bg-white rounded-xl shadow-sm">
      <div className="absolute top-6 right-6 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;