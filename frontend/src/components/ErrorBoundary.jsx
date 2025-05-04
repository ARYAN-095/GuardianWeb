// src/components/ErrorBoundary.jsx
import { useRouteError, Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/outline';

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error('Routing Error:', error);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-700 mb-6">
          {error.statusText || error.message}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}