# Changelog

## 1.1.0

### Added

- Configurable reactions, icons and animations through `config.json`.
- Localization that follows the Web App 3 language selection, powered by
  i18next with English, German and Spanish translations.
- Configurable translation keys for custom reactions.
- Local HTTPS development with environment settings, Web App 3/API proxying
  and an automatically generated branding manifest.
- Documentation for configuration, localization, plugin ID and
  required sandbox permissions.

### Changed

- Renamed the plugin ID to `webapp3-plugin-reactions`.
- Improved animation positioning for mobile and presentation layouts.
- Remove reaction animations when their animation finishes.
- Updated dependencies and TypeScript module resolution.

### Removed

- ESLint setup, Yarn lockfile and unused Jest test script.
- `vite.json` development settings, replaced by `.env`.

## 1.0.0

- Initial release with applause, love and laugh reactions.
