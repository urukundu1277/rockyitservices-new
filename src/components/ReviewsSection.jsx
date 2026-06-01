import { useState, useEffect } from "react";
import axios from "axios";

export default function ReviewsSection() {
  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Default sample reviews (fallback)
  const defaultReviews = [
    {
      id: 1,
      name: "Venkatesh",
      rating: 5,
      service: "Printer Repair",
      message: "Very good service! They fixed my printer quickly and perfectly. The team is very helpful and professional. Highly recommended!",
      date: "2024-05-20"
    },
    {
      id: 2,
      name: "Ranjith",
      rating: 5,
      service: "Website Hosting",
      message: "Great website hosting service! My website is very fast and secure now. Excellent support team and very good customer service.",
      date: "2024-05-18"
    },
    {
      id: 3,
      name: "Pravalika",
      rating: 4,
      service: "Laptop Repair",
      message: "Good laptop repair service! They fixed my laptop very well and quickly. Very happy with their work and professional service.",
      date: "2024-05-16"
    },
    {
      id: 4,
      name: "Ganesh",
      rating: 5,
      service: "Hardware Changes",
      message: "Amazing work! They changed my laptop hardware perfectly. Very professional team and good quality parts. Very satisfied!",
      date: "2024-05-14"
    },
  ];

  const [reviews, setReviews] = useState(defaultReviews);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [feedbackForm, setFeedbackForm] = useState({
    fullName: "",
    email: "",
    serviceUsed: "",
    rating: 5,
    feedbackMessage: "",
  });

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch approved reviews from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await axios.get(`${API_URL}/reviews`);
        
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Map backend reviews to frontend format
          const backendReviews = response.data.data.map((review, index) => ({
            id: index + 1,
            name: review.name,
            rating: review.rating,
            service: review.service,
            message: review.message,
            date: review.createdAt ? review.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          }));
          
          setReviews(backendReviews);
          console.log("[ReviewsSection] Backend reviews loaded successfully");
        } else {
          // Use default reviews if no backend reviews found
          setReviews(defaultReviews);
          console.log("[ReviewsSection] No backend reviews found, using defaults");
        }
      } catch (error) {
        console.error("[ReviewsSection] Failed to fetch reviews from backend:", error.message || error);
        // Keep using default reviews as fallback
        setReviews(defaultReviews);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    // Only fetch if API_URL is configured
    if (API_URL) {
      fetchReviews();
    } else {
      console.warn("[ReviewsSection] VITE_API_URL not configured, using default reviews");
      setIsLoadingReviews(false);
    }
  }, [API_URL]);

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm({
      ...feedbackForm,
      [name]: name === "rating" ? parseInt(value) : value,
    });
  };

  const validateForm = () => {
    if (!feedbackForm.fullName.trim()) {
      setErrorMessage("Full name is required");
      return false;
    }
    if (!feedbackForm.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackForm.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!feedbackForm.serviceUsed.trim()) {
      setErrorMessage("Please select a service");
      return false;
    }
    if (!feedbackForm.feedbackMessage.trim()) {
      setErrorMessage("Feedback message is required");
      return false;
    }
    return true;
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Use API URL from environment variables
      const reviewApiUrl = `${API_URL}/reviews`;
      console.log("[ReviewsSection] Submitting review to:", reviewApiUrl);

      const response = await axios.post(reviewApiUrl, {
        name: feedbackForm.fullName,
        email: feedbackForm.email,
        service: feedbackForm.serviceUsed,
        rating: feedbackForm.rating,
        message: feedbackForm.feedbackMessage,
      });

      if (response.status === 200 || response.status === 201) {
        // Add new review to the list
        const newReview = {
          id: reviews.length + 1,
          name: feedbackForm.fullName,
          rating: feedbackForm.rating,
          service: feedbackForm.serviceUsed,
          message: feedbackForm.feedbackMessage,
          date: new Date().toISOString().split('T')[0],
        };

        setReviews([newReview, ...reviews]);
        setFeedbackForm({
          fullName: "",
          email: "",
          serviceUsed: "",
          rating: 5,
          feedbackMessage: "",
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        console.log("[ReviewsSection] Review submitted successfully");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to submit feedback";
      setErrorMessage(msg);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      console.error("[ReviewsSection] Error submitting review:", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  const currentReview = reviews[currentReviewIndex];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Customer Reviews & Feedback
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Hear from our satisfied customers and share your experience
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* LEFT SIDE - Reviews Display */}
        <div className="space-y-4">
          {/* Rating Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-4xl font-bold text-gray-900">
                  {averageRating}
                </div>
                <div className="mt-1">{renderStars(Math.round(averageRating))}</div>
                <p className="text-gray-600 mt-1 text-xs">
                  Based on {reviews.length} customer reviews
                </p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>

          {/* Review Carousel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 overflow-hidden">
            {currentReview && (
              <div className="space-y-3 animate-fade-in">
                {/* Review Content */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {currentReview.name}
                      </h4>
                      <p className="text-xs text-cyan-600 font-semibold mt-0.5">
                        {currentReview.service}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">{renderStars(currentReview.rating)}</div>

                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{currentReview.message}"
                  </p>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <button
                    onClick={prevReview}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-cyan-500 text-gray-700 hover:text-white transition-all duration-300"
                    aria-label="Previous review"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="flex gap-1.5">
                    {reviews.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentReviewIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentReviewIndex
                            ? "bg-cyan-500 w-5"
                            : "bg-gray-300 w-1.5 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to review ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextReview}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-cyan-500 text-gray-700 hover:text-white transition-all duration-300"
                    aria-label="Next review"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Review Count Indicator */}
          <div className="text-center text-xs text-gray-600">
            Review {currentReviewIndex + 1} of {reviews.length}
          </div>
        </div>

        {/* RIGHT SIDE - Feedback Form */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl shadow-lg border border-gray-200 p-5 md:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Share Your Feedback
          </h3>
          <p className="text-gray-600 text-xs mb-4">
            Your feedback helps us improve our services. We'd love to hear from you!
          </p>

          <form onSubmit={submitFeedback} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={feedbackForm.fullName}
                onChange={handleFeedbackChange}
                placeholder="Your name"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={feedbackForm.email}
                onChange={handleFeedbackChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              />
            </div>

            {/* Service Used */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Service Used *
              </label>
              <select
                name="serviceUsed"
                value={feedbackForm.serviceUsed}
                onChange={handleFeedbackChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-sm"
                required
              >
                <option value="">Select a service</option>
                <option value="AWS Cloud Services">AWS Cloud Services</option>
                <option value="Website Design">Website Design</option>
                <option value="Website Hosting">Website Hosting</option>
                <option value="Laptop Repair">Laptop Repair</option>
                <option value="Desktop Repair">Desktop Repair</option>
                <option value="Printer Repair">Printer Repair</option>
                <option value="Networking Solutions">Networking Solutions</option>
                <option value="WiFi Setup">WiFi Setup</option>
                <option value="Software Installation">Software Installation</option>
                <option value="Windows Installation">Windows Installation</option>
                <option value="Computer AMC Services">Computer AMC Services</option>
                <option value="Server Maintenance">Server Maintenance</option>
                <option value="Custom PC Build">Custom PC Build</option>
                <option value="VPN Setup">VPN Setup</option>
                <option value="Remote IT Support">Remote IT Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFeedbackForm({ ...feedbackForm, rating: star })
                    }
                    className="focus:outline-none transition-transform duration-200 hover:scale-110"
                  >
                    <svg
                      className={`h-6 w-6 ${
                        star <= feedbackForm.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-1 text-xs text-gray-600">
                  {feedbackForm.rating} stars
                </span>
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Feedback *
              </label>
              <textarea
                name="feedbackMessage"
                value={feedbackForm.feedbackMessage}
                onChange={handleFeedbackChange}
                placeholder="Share your experience with us..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 transform"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Thank you! Your feedback has been submitted successfully.
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
