import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="text-6xl mb-4">🤔</div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/dashboard/hsk-library">
              <Search className="w-5 h-5" />
              Browse HSK Library
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-4">Helpful links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/dashboard/articles" className="text-blue-600 hover:underline">
              Daily Articles
            </Link>
            <Link href="/dashboard/learn" className="text-blue-600 hover:underline">
              Learning Center
            </Link>
            <Link href="/dashboard/words" className="text-blue-600 hover:underline">
              My Word Bank
            </Link>
            <Link href="/dashboard/stats" className="text-blue-600 hover:underline">
              Statistics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



