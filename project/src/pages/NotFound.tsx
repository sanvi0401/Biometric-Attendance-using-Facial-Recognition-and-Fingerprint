import { Link } from 'react-router-dom';
import { Fingerprint, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4 text-center">
      <div className="bg-primary-50 p-6 rounded-full mb-6">
        <Fingerprint className="h-16 w-16 text-primary-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Page Not Found</h2>
      
      <p className="text-neutral-600 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/" className="btn-primary flex items-center">
        <Home className="mr-2 h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;