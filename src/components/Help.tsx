import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '../assets/did-health.png' // Ensure this is correctly imported

export const Help = () => {
  const { t } = useTranslation('help')
  const topics = t('topics', { returnObjects: true }) as {
    id: string
    title: string
    content: string
  }[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg bg-white/10 backdrop-blur-md ring-2 ring-red-400/40">
          <img
            src={logo}
            alt="did:health Logo"
            className="w-full h-full object-contain scale-110 transition-transform duration-300 hover:scale-125"
          />
        </div>

        {/* Back Home Button */}
        <Link
          to="/"
          className="inline-block px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-colors"
          aria-label="Back to home"
        >
          {t('backHome', 'Back Home')}
        </Link>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {t('helpCenterTitle', 'More Answers')}
        </h1>
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-5 rounded-xl shadow-sm bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {topic.title}
            </h2>
            <p
              className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: topic.content.replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,
                  '<a class="text-blue-600 underline hover:text-blue-800" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
                ),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
