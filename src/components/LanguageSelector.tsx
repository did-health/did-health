// src/components/LanguageSelector.tsx
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

  return (
    <div className="absolute top-4 right-4">
      <select
        onChange={changeLanguage}
        value={i18n.language}
        className="border px-2 py-1 rounded text-sm bg-white dark:bg-gray-800 dark:text-white"
      >
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
        {/* Add more languages as needed */}
      </select>
    </div>
  )
}

export default LanguageSelector
