const PATHS = {
  sofa: 'M4 14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1v2h-2v-2H8v2H6v-2H5a1 1 0 0 1-1-1v-3ZM6 12V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3',
  bed: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M3 18v2M21 18v2M5 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3',
  table: 'M3 7h18M3 7v2M21 7v2M5 7v10M19 7v10M5 17h2M17 17h2',
  fridge: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM5 9h14M9 6v1.5M9 12v1.5',
  washing_machine: 'M4 4h16v16H4V4ZM4 7.5h16M12 14a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM6.5 5.5h.01M9 5.5h.01',
  tv: 'M3 5h18v11H3V5ZM9 20h6M12 16v4',
  furniture: 'M4 14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1v2h-2v-2H8v2H6v-2H5a1 1 0 0 1-1-1v-3ZM6 12V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3',
  appliance: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM5 9h14M9 6v1.5M9 12v1.5',
  default: 'M3 7l9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10',
}

const CategoryIcon = ({ type, className = 'h-6 w-6' }) => {
  const d = PATHS[type] || PATHS.default

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export default CategoryIcon