// components/Help.tsx
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const Help = () => {
  const { t } = useTranslation('help')
  const topics = t('topics', { returnObjects: true }) as {
    id: string
    title: string
    content: string
  }[]

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Help Center</h1>
      {topics.map(topic => (
        <div key={topic.id} className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold">{topic.title}</h2>
          <p className="mt-2 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: topic.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-blue-600 underline" href="$2">$1</a>') }} />
        </div>
      ))}
    </div>
  )
}
