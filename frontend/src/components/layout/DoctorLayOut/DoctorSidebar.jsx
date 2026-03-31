export default function DoctorSidebar({ activeKey, onMenuChange, menuItems = [] }) {
  return (
    <aside className="col-span-12 border-b border-slate-200 bg-white p-4 md:col-span-3 md:min-h-full md:border-b-0 md:border-r lg:col-span-2">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Menu chính</div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onMenuChange?.(item.key)}
              className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
