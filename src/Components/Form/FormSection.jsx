export default function FormSection({ title, children }) {
  return (
    <div className="space-y-4 pt-6">
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}
