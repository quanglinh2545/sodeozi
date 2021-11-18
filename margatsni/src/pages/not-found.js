import { useEffect } from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = 'ページが見つからない';
  }, []);

  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <Link to={`/`}>
          <p className="text-center text-2xl">ページが見つかりません！</p>
        </Link>
      </div>
    </div>
  );
}
