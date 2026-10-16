/** Lista de marcadores com rótulo pequeno. */
export function Bullets({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="label mb-1">{title}</p>
      <ul className="max-w-3xl list-disc space-y-1.5 pl-5 marker:text-(--coral)">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
