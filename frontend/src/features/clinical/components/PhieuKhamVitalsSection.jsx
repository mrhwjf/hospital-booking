import VitalSigns from "./VitalSigns";

export default function PhieuKhamVitalsSection({ data, editable, onChange }) {
  return <VitalSigns data={data} editable={editable} onChange={onChange} />;
}
