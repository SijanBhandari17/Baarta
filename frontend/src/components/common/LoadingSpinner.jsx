const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);
export default LoadingSpinner;
