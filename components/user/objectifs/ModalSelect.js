const ModalSelect = ({ icon: Icon, label, value, onChange, options, isLoading }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-[#3B82F6] transition-all">
    <Icon className="text-2xl text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <select
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none"
        value={value}
        onChange={onChange}
        disabled={isLoading}
      >
        
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.nom} ({option.type})
          </option>
        ))}
      </select>
    </div>
  </div>
);
export default ModalSelect;