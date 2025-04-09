
import { Button } from "@/components/ui/button";
import { TimePeriod } from "@/types";

interface TimeFilterProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export function TimeFilter({ selected, onChange }: TimeFilterProps) {
  const options: { value: TimePeriod; label: string }[] = [
    { value: "7days", label: "7 Days" },
    { value: "30days", label: "30 Days" },
    { value: "90days", label: "90 Days" },
    { value: "1year", label: "1 Year" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
