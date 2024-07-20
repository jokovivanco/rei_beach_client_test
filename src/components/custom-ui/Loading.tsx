const Loading = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <span className="relative flex h-16 w-16">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/90 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-16 w-16 bg-primary"></span>
      </span>
    </div>
  );
};
export default Loading;
