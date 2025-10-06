import SequenceCard, { type EmailSequence } from "../SequenceCard";

export default function SequenceCardExample() {
  const sampleSequence: EmailSequence = {
    id: "1",
    name: "Welcome Series",
    emailCount: 3,
    status: "active",
    leadsInSequence: 12
  };

  return (
    <div className="p-8 max-w-sm">
      <SequenceCard
        sequence={sampleSequence}
        onStart={(id) => console.log("Start:", id)}
        onPause={(id) => console.log("Pause:", id)}
        onStop={(id) => console.log("Stop:", id)}
      />
    </div>
  );
}
