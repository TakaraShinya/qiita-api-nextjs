const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
        <p className="text-xl text-white">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
