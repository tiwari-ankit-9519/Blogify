const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
