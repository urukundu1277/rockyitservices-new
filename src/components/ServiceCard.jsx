import React from "react";

export default function ServiceCard({ icon, title, description, onBook }) {
	return (
		<div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
			<div className="flex items-start gap-4">
				<div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-50 flex items-center justify-center text-xl sm:text-2xl">{icon}</div>
				<div className="flex-grow">
					<h3 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h3>
					<p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
				</div>
			</div>

			<div className="mt-5 flex justify-end">
				<button onClick={onBook} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition shadow-md">
					Book Service
				</button>
			</div>
		</div>
	);
}
