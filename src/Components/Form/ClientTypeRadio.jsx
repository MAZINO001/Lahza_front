import { Label } from "../../Components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../Components/ui/radio-group";
import ErrorMessage from "../../Components/Form/ErrorMessage";

export default function ClientTypeRadio({ value, onChange, errors }) {
  return (
    <div className="[&_svg]:w-3 [&_svg]:h-3">
      <Label className="text-foreground">Type de client</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex space-x-6 mt-3"
      >
        {/* Individuel Option */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="individual"
            id="type_individuel"
            className="border-2 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
          <Label
            htmlFor="type_individuel"
            className="select-none text-muted-foreground data-[state=checked]:text-primary transition-colors"
          >
            Individuel
          </Label>
        </div>

        {/* Entreprise Option */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="company"
            id="type_entreprise"
            className="border-2 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
          <Label
            htmlFor="type_entreprise"
            className="select-none text-muted-foreground data-[state=checked]:text-primary transition-colors"
          >
            Entreprise
          </Label>
        </div>
      </RadioGroup>

      {errors && <ErrorMessage errors={errors} field="type_client" />}
    </div>
  );
}
