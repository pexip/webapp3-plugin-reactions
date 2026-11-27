/**
 * The icon interface
 * @param main The main icon
 * @param hover The hover icon
 * @param text The text
 */
interface Icon {
  main: string
  hover?: string
  text: string
}

interface ResourceIcon {
  main: string
  hover?: string
}

/**
 * The resource interface
 * @param id The id
 * @param icon The icon
 */
interface Resource {
  id: string
  translationKey: string
  icon: ResourceIcon
  source: string
  toastIcon: string
}

/**
 * The configuration interface
 * @param resources Array of resources
 */
interface Configuration {
  resources: Resource[]
}
