import { TabsList, TabsTrigger } from "../ui/tabs";

export default function RoleTabs({ value, onChange }) {
  const tabs = [
    { value: "team", label: "Équipe" },
    { value: "intern", label: "Stage" },
    { value: "other", label: "Autre" },
  ];

  return (
    <TabsList className="grid grid-cols-3 w-full h-12 border border-border bg-muted rounded-md overflow-hidden">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            data-[state=active]:bg-primary
            data-[state=active]:text-primary-foreground
            data-[state=active]:shadow-md
            data-[state=inactive]:text-muted-foreground
            data-[state=inactive]:hover:bg-[var(--muted-foreground)/10]
            transition-all duration-200
          `}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
