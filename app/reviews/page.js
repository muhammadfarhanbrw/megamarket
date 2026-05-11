// app/reviews/page.js
import Reviews from '../(components)/Reviews';

export const metadata = {
  title: 'Customer Reviews - MegaMarkeet',
  description: 'Read what our customers say about our products and services',
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Reviews />
      </div>
    </div>
  );
}