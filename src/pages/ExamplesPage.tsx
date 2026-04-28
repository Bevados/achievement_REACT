export default function ExamplesPage() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">Примеры коллекций</h1>
      <p className="mt-3 max-w-2xl text-sm text-gray-700 sm:text-base">
        Публичный раздел примеров остается доступным для гостя и будет подключен к API в рамках
        следующего шага публичной части UI.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="rounded-xl border border-dashed border-sky-300 bg-sky-50/50 p-4 text-sm text-sky-800"
          >
            Пример коллекции #{index + 1}
          </article>
        ))}
      </div>
    </section>
  );
}
