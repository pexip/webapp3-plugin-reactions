import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend'

export const initializeLocalization = async (
  basePath: string,
  language: string
) => {
  await i18next.use(HttpBackend).init({
    lng: language,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'es'],
    load: 'languageOnly',
    backend: {
      loadPath: `${basePath}/locales/{{lng}}/translation.json`
    },
    interpolation: {
      escapeValue: false
    }
  })

  return i18next
}
