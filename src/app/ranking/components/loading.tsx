const Loading = () => {
  return (
    <div aria-label="読み込み中" className="flex h-svh items-center justify-center">
      <p className="px-6 text-6xl text-white">Loading</p>
      <div className="h-14 w-14 animate-spin rounded-xl bg-white"></div>
    </div>
  );
};

export default Loading;
