import { Link } from 'react-router-dom';
import { homeBenefits, homePreviewCards } from '../config/home.config';

interface HomePageProps {
  onCreateCollection: () => void;
}

export default function HomePage({ onCreateCollection }: HomePageProps) {
  return (
    <div className="space-y-12 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200 bg-linear-to-br from-white via-sky-50 to-blue-100 px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-blue-200/40 blur-2xl" aria-hidden="true" />
        <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-cyan-200/40 blur-2xl" aria-hidden="true" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              Achievement Collections
            </p>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Собирайте достижения в живые коллекции, а не в разрозненные заметки
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
              Объединяйте планы, завершенные шаги и важные детали в одном месте. От личных
              привычек до карьерных рывков - ваш прогресс всегда перед глазами.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCreateCollection}
                className="inline-flex w-full items-center justify-center rounded-xl bg-secondary px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-secondary-dark sm:w-auto"
              >
                Создать коллекцию
              </button>
              <Link
                to="/examples"
                className="inline-flex w-full items-center justify-center rounded-xl border border-sky-300 bg-white/80 px-6 py-3 text-center text-base font-semibold text-sky-700 transition hover:bg-sky-50 sm:w-auto"
              >
                Посмотреть примеры
              </Link>
            </div>
          </div>

          <aside
            className="hidden rounded-2xl border border-sky-200 bg-white/80 p-5 shadow-sm lg:block"
            data-testid="home-hero-visual"
            aria-label="Визуальный пример коллекции"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Ваша доска прогресса</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-emerald-800">Learning Roadmap</p>
                <p className="mt-1 text-xs text-emerald-700">4 из 7 этапов завершено</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-semibold text-amber-800">Travel Goals</p>
                <p className="mt-1 text-xs text-amber-700">Следующая точка: Будапешт</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm font-semibold text-blue-800">Fitness Challenge</p>
                <p className="mt-1 text-xs text-blue-700">Текущий статус: in_progress</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {homeBenefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <h2 className="text-lg font-semibold text-primary">{benefit.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{benefit.description}</p>
          </article>
        ))}
      </section>

      <section id="preview" className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Превью коллекций</h2>
            <p className="mt-2 text-sm text-gray-700">
              Здесь появятся реальные карточки после подключения API на следующих шагах.
            </p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            Demo
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homePreviewCards.map((title) => (
            <article
              key={title}
              className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/60 p-4"
              data-testid="preview-card"
            >
              <p className="text-sm font-semibold text-sky-900">{title}</p>
              <p className="mt-2 text-xs text-sky-700">Контент будет подгружаться из backend.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
