import SelectedServices from "./SelectedServices";

export default function ChiDinhSavedSummary({
  selectedServices,
  setSelectedServices,
  onSave,
  isSaving,
  isLocked,
}) {
  return (
    <SelectedServices
      services={selectedServices}
      setSelectedServices={setSelectedServices}
      onSave={isLocked ? undefined : onSave}
      isSaving={isSaving || isLocked}
      isLocked={isLocked}
    />
  );
}
