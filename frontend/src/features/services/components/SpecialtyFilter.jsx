function SpecialtyFilter({ specialties, selectedSpecialty, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          selectedSpecialty === ''
            ? 'border-teal-700 bg-teal-700 text-white'
            : 'border-slate-300 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-700'
        }`}
        onClick={() => onChange('')}
        type="button"
      >
        Tất cả
      </button>

      {specialties.map((specialty) => (
        <button
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            String(selectedSpecialty) === String(specialty.id)
              ? 'border-teal-700 bg-teal-700 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-teal-600 hover:text-teal-700'
          }`}
          key={specialty.id}
          onClick={() => onChange(specialty.id)}
          type="button"
        >
          {specialty.name}
        </button>
      ))}
    </div>
  )
}

export default SpecialtyFilter
