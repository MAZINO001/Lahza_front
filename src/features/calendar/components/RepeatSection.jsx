import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";
import DateField from "@/components/Form/DateField";
import { Controller, useForm } from "react-hook-form";

export function RepeatSection({
  repeatEnabled,
  onRepeatChange,
  frequency,
  onFrequencyChange,
  everyN,
  onEveryNChange,
  endType,
  onEndTypeChange,
  afterOccurrences,
  onAfterOccurrencesChange,
  endsOnDate,
  onEndsOnDateChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: "",
      number: "",
      every_n: "",
      repeat_frequency: "",
    },
  });

  const getFrequencyLabel = () => {
    const labels = {
      daily: "day",
      weekly: "week",
      monthly: "month",
      yearly: "year",
    };
    return labels[frequency] || "day";
  };

  const getEndTypeLabel = () => {
    if (endType === "never") return "Never";
    if (endType === "after") return `After ${afterOccurrences} occurrences`;
    if (endType === "on") return `On ${endsOnDate}`;
    return "Never";
  };

  const handleRepeatToggle = (checked) => {
    onRepeatChange(checked);
    if (checked) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-3 border border-border rounded-lg p-4 bg-background">
      {/* Repeat Header - Always Visible */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox
            id="repeat-toggle"
            checked={repeatEnabled}
            onCheckedChange={handleRepeatToggle}
            className="mt-1"
          />
          <div>
            <Label
              htmlFor="repeat-toggle"
              className="text-sm font-semibold text-foreground cursor-pointer"
            >
              Repeat
            </Label>
            {repeatEnabled && (
              <p className="text-xs text-muted-foreground mt-1">
                Every {everyN} {getFrequencyLabel()}
                {Number(everyN) > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {repeatEnabled && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Repeat Content - Collapsible */}
      {repeatEnabled && isOpen && (
        <div className="space-y-4 pt-3 border-t border-border">
          {/* Repeats Section */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Repeats
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Controller
                  name="repeat_frequency"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <SelectField
                      id="repeat_frequency"
                      label="Frequency"
                      value={frequency}
                      onChange={(val) => onFrequencyChange(val)}
                      options={[
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "yearly", label: "Yearly" },
                      ]}
                    />
                  )}
                />
              </div>

              <div>
                <Label
                  htmlFor="every_n"
                  className="text-xs text-muted-foreground"
                >
                  Every
                </Label>
                <Controller
                  name="every_n"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <FormField
                      id="every_n"
                      type="number"
                      min="1"
                      value={everyN}
                      onChange={(e) => onEveryNChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Ends Section */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Ends
            </div>

            <div className="space-y-2">
              {/* Never */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ends-never"
                  checked={endType === "never"}
                  onCheckedChange={() => onEndTypeChange("never")}
                />
                <Label
                  htmlFor="ends-never"
                  className="text-sm text-foreground cursor-pointer"
                >
                  Never
                </Label>
              </div>

              {/* After */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ends-after"
                  checked={endType === "after"}
                  onCheckedChange={() => onEndTypeChange("after")}
                />
                <Label htmlFor="ends-after" className="text-sm text-foreground">
                  After
                </Label>
                <Controller
                  name="number"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <FormField
                      type="number"
                      min="1"
                      value={afterOccurrences}
                      onChange={(e) => onAfterOccurrencesChange(e.target.value)}
                      disabled={endType !== "after"}
                      placeholder="10"
                      className="w-18 h-9 px-2 mr-4"
                    />
                  )}
                />
                <span className="text-sm text-foreground">occurrences</span>
              </div>

              {/* On Date */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ends-on"
                  checked={endType === "on"}
                  onCheckedChange={() => onEndTypeChange("on")}
                />
                <Label htmlFor="ends-on" className="text-sm text-foreground">
                  On
                </Label>

                <Controller
                  name="start_date"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <DateField
                      id="start_date"
                      type="date"
                      value={endsOnDate}
                      disabled={endType !== "on"}
                      error={errors.start_date?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Summary - Shows when collapsed */}
      {repeatEnabled && !isOpen && (
        <div className="space-y-1 pt-2">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Repeats:</span> Every {everyN}{" "}
            {getFrequencyLabel()}
            {Number(everyN) > 1 ? "s" : ""}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Ends:</span> {getEndTypeLabel()}
          </div>
        </div>
      )}
    </div>
  );
}

export default RepeatSection;
