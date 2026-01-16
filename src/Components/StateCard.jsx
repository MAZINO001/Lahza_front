export function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const colorClasses =
    {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      orange: "bg-orange-50 text-orange-600",
      slate: "bg-background text-muted-foreground",
    }[color] || "bg-background text-muted-foreground";

  return (
    <div className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
