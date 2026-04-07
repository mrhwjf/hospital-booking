import ClinicalNotes from "./ClinicalNotes";
import ClinicalActions from "./ClinicalActions";

export default function PhieuKhamClinicalNotesSection({
  data,
  sourceData,
  editable,
  isSaving,
  isLocked,
  onChange,
  icd10Options,
  isLoadingIcd10,
  onSearchIcd10,
  onSelectIcd10,
  onEditToggle,
  onSave,
}) {
  return (
    <div
      className="bg-white rounded-[10px] px-0 py-5"
      style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px 0 rgba(15,118,110,0.06)" }}
    >
      <ClinicalNotes
        data={data}
        editable={editable}
        onChange={onChange}
        sourceData={sourceData}
        icd10Options={icd10Options}
        isLoadingIcd10={isLoadingIcd10}
        onSearchIcd10={onSearchIcd10}
        onSelectIcd10={onSelectIcd10}
      />
      {!isLocked ? (
        <ClinicalActions
          type="phieu-kham"
          isEditing={editable}
          isSaving={isSaving}
          onEdit={onEditToggle}
          onSubmit={onSave}
          disabled={!editable || isSaving}
        />
      ) : null}
    </div>
  );
}
