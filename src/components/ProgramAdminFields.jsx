export default function ProgramAdminFields({ form, onChange, includeFeeDuration = false }) {
  const fields = [
    ...(includeFeeDuration ? [["fee", "Total fee in INR (0 for free)", "number"], ["duration", "Duration", "text"]] : []),
    ["programStartInfo", "Program start date or expected start", "text"],
    ["deliverables", "What students receive (include certificate criteria if offered)", "text"],
    ["eligibility", "Eligibility and prerequisites", "text"],
    ["deliveryDetails", "Digital delivery method and access timeline after payment", "text"],
  ];
  return <fieldset className="program-admin-fields"><legend>Program information shown before payment</legend>
    <p>Complete these details before accepting payment. Use the total payable fee, including applicable charges. Registration dates are separate from the program start.</p>
    {fields.map(([name, label, type]) => <label key={name}>{label}{["deliverables", "eligibility", "deliveryDetails"].includes(name) ? <textarea name={name} rows={3} value={form[name] ?? ""} onChange={onChange} /> : <input name={name} type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} value={form[name] ?? ""} onChange={onChange} />}</label>)}
  </fieldset>;
}
