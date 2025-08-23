import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PiggyBank, BarChart3 } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    title: 'Track Expenses',
    description: 'Monitor your spending habits and categorize expenses effortlessly.',
    Icon: Wallet,
  },
  {
    title: 'Set Budgets',
    description: 'Create and manage budgets to stay on top of your financial goals.',
    Icon: PiggyBank,
  },
  {
    title: 'View Reports',
    description: 'Get detailed insights with visual reports and analytics.',
    Icon: BarChart3,
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Wallet className="mx-auto h-16 w-16 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to Finance Tracker
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Take control of your finances with our comprehensive tracking tools.
            Monitor expenses, set budgets, and achieve your financial goals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/login"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              Icon={feature.Icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;