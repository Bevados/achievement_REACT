export default function CollectionsPage() {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">Мои коллекции</h1>
      <p className="mt-3 max-w-2xl text-sm text-gray-700 sm:text-base">
        Этот экран уже доступен только авторизованному пользователю. На следующем шаге сюда
        подключим загрузку реальных коллекций и CRUD-сценарии.
      </p>
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
        Пока отображается базовая заготовка private-раздела.
      </div>
    </section>
  );
}
