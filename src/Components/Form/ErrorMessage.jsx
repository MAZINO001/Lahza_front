import InputError from "../InputError";

export default function ErrorMessage({ errors, field }) {
  if (!errors || !field) return null;

  return (
    <InputError
      message={errors[field]}
      className="mt-2 text-[var(--destructive)]"
    />
  );
}
