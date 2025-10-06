import EmailSequenceBuilder from "../EmailSequenceBuilder";

export default function EmailSequenceBuilderExample() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <EmailSequenceBuilder
        onSave={(steps) => console.log("Sequence saved:", steps)}
      />
    </div>
  );
}
