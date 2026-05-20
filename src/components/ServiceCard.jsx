import React from "react";

export default function ServiceCard({ icon, title, description, onBook }) {
	return (
		<div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-2xl">{icon}</div>
				<div>
					<h3 className="text-xl font-semibold text-gray-800">{title}</h3>
					<p className="text-sm text-gray-600 mt-1">{description}</p>
				</div>
			</div>

			<div className="mt-6 flex justify-end">
				<button onClick={onBook} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
					Book Service
				</button>
			</div>
		</div>
	);
}
