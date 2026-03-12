import { Star } from "lucide-react";

interface Review {
  id: string;
  text: string;
  rating: number;
  date: string;
  sentiment: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-medium mb-6">Sample Analyzed Reviews</h3>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{review.text}</p>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  review.sentiment === "Positive"
                    ? "bg-emerald-50 text-emerald-700"
                    : review.sentiment === "Negative"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {review.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
