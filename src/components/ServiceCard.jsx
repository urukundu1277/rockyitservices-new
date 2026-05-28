import React from "react";

export default function ServiceCard({
  icon,
  title,
  description,
  onBook,
  index = 0,
}) {
  // Different colors for every card
  const colorThemes = [
    {
      card:
        "from-cyan-500/20 to-blue-500/10 border-cyan-300/20",
      iconBg: "bg-cyan-100 text-cyan-700",
      button:
        "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
    },
    {
      card:
        "from-pink-500/20 to-rose-500/10 border-pink-300/20",
      iconBg: "bg-pink-100 text-pink-700",
      button:
        "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
    },
    {
      card:
        "from-emerald-500/20 to-green-500/10 border-emerald-300/20",
      iconBg: "bg-emerald-100 text-emerald-700",
      button:
        "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
    },
    {
      card:
        "from-yellow-500/20 to-orange-500/10 border-yellow-300/20",
      iconBg: "bg-yellow-100 text-orange-700",
      button:
        "from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700",
    },
    {
      card:
        "from-purple-500/20 to-violet-500/10 border-purple-300/20",
      iconBg: "bg-purple-100 text-purple-700",
      button:
        "from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
    },
    {
      card:
        "from-red-500/20 to-rose-500/10 border-red-300/20",
      iconBg: "bg-red-100 text-red-700",
      button:
        "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
    },
  ];

  const theme = colorThemes[index % colorThemes.length];

  return (
    <div
      className={`bg-gradient-to-br ${theme.card} backdrop-blur-md border rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${theme.iconBg} flex items-center justify-center text-xl sm:text-2xl`}
        >
          {icon}
        </div>

        <div className="flex-grow">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={onBook}
          type="button"
          className={`px-4 py-2 bg-gradient-to-r ${theme.button} text-white rounded-lg transition shadow-md`}
        >
          Book Service
        </button>
      </div>
    </div>
  );
}