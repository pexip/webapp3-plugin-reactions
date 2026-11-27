import { registerPlugin } from '@pexip/plugin-api'
import {
  getBasePath,
  getResource,
  readConfig,
  createMenuGroup,
  getMessageReactionTypeProperty
} from './utils'
import { RESOURCE_PATH } from './constants'
import { initializeLocalization } from './localization'

const plugin = await registerPlugin({
  id: 'webapp3-plugin-reactions',
  version: 0
})

let selectedLanguage: string | undefined
let applyLanguage = (_language: string): Promise<void> => Promise.resolve()

plugin.events.languageSelect.add((language) => {
  selectedLanguage = language
  void applyLanguage(language).catch((error) => {
    console.error('Failed to apply the selected Web App 3 language.', error)
  })
})

const basePath = getBasePath()
const i18next = await initializeLocalization(
  basePath,
  selectedLanguage ?? navigator.language
)
const configuration = await readConfig(basePath)
if (selectedLanguage) {
  await i18next.changeLanguage(selectedLanguage)
}

const translate = (key: string) => String(i18next.t(key))
const menuGroup = await createMenuGroup(basePath, configuration, translate)

const btn = await plugin.ui.addButton(menuGroup).catch((e) => {
  console.warn(e)
})

applyLanguage = async (language) => {
  await i18next.changeLanguage(language)
  await btn?.update(await createMenuGroup(basePath, configuration, translate))
}

if (selectedLanguage) {
  await applyLanguage(selectedLanguage)
}

btn?.onClick.add(async ({ buttonId }) => {
  createReaction(buttonId)

  const resource = getResource(buttonId, configuration)

  plugin.ui.showToast({
    message: String(
      i18next.t('toast.ownReaction', { reaction: resource?.toastIcon ?? '' })
    ),
    isInterrupt: true
  })

  plugin.conference.sendApplicationMessage({
    payload: {
      'reaction-type': buttonId
    }
  })
})

const createReaction = (reactionId: string) => {
  const root = parent.document.querySelector(
    'div[data-testid="meeting-wrapper"]'
  )

  if (root === null) {
    throw new Error(
      'Could not find video wrapper to attach the reaction animation.'
    )
  }

  const resource = getResource(reactionId, configuration)
  const image = parent.document.createElement('img')

  image.setAttribute('src', basePath + RESOURCE_PATH + resource?.source)
  image.setAttribute('class', 'reactionImage')

  const randomOffset = 50 + (Math.random() - 0.5) * 80;
  image.style.left = `${randomOffset}%`
  image.style.bottom = 50 - 20 * Math.random() + 'vh'

  const id = 'rid' + Date.now()
  image.setAttribute('id', id)
  image.setAttribute('name', id)

  root.appendChild(image)
  reactionJanitor(image)
}

await plugin.events.applicationMessage.add((message) => {
  const reactionType = getMessageReactionTypeProperty(message)

  if (reactionType) {
    createReaction(reactionType)
    plugin.ui.showToast({
      message: String(
        i18next.t('toast.otherReaction', {
          name: message.displayName,
          reaction: getResource(reactionType, configuration)?.toastIcon ?? ''
        })
      ),
      isInterrupt: true
    })
  }
})

const reactionJanitor = (item: HTMLImageElement) => {
  item.addEventListener('animationend', function (event) {
    // Remove the element after the animation is done
    item?.remove()
  })
}

/**
 * Add the style to the parent document
 */
const style = document.createElement('link')
style.rel = 'stylesheet'
style.href = getBasePath() + '/style.css'
parent.document.head.appendChild(style)
