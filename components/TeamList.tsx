type Team = {
  name: string;
  letter: string;
};

const teams: Team[] = [
  { name: "Heroicons", letter: "H" },
  { name: "Tailwind Labs", letter: "T" },
  { name: "Workcation", letter: "W" },
];

export default function TeamList() {
  return (
    <div className="mt-8">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Your teams
      </p>
      <ul className="mt-2 space-y-1">
        {teams.map((team) => (
          <li key={team.name}>
            <div className="group flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 transition-colors duration-150 group-hover:border-gray-300 group-hover:text-gray-700">
                {team.letter}
              </span>
              <span className="truncate">{team.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
