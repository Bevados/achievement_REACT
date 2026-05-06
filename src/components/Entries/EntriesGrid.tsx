import type { EntryView } from '../../../contracts/collection.contracts';
import EntryCard from './EntryCard';

interface EntriesGridProps {
  entries: EntryView[];
  emptyMessage: string;
}

export default function EntriesGrid({ entries, emptyMessage }: EntriesGridProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
