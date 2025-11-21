const Loader = ({ fullScreen = true }) => {
  const loaderClasses = "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary";
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className={loaderClasses}></div>
      </div>
    );
  }

  return <div className={`mx-auto ${loaderClasses}`}></div>;
};

export default Loader;