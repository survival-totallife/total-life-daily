import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Total Life Daily</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
