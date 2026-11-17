# Web App 3 Plugin: Reactions

This plugin lets users share reactions with the other participants in a
conference. The reactions, their icons, animations and texts are configurable.
By default, five reactions are available: applause, love, laugh, laugh loud and
sad.

The animations come from
[Noto Emoji animations](https://googlefonts.github.io/noto-emoji-animation/),
which are licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

To use this plugin you need **Pexip Infinity v35** or later.

## How to use

The plugin adds a button to the toolbar that any user can use during a
conference to share reactions with the other participants:

<div align='center'>

![Reactions button in the toolbar](./images/button.png)

</div>

- When the user selects a reaction, a toast message is displayed at the top:

<div align='center'>

![Toast message shown to the user who reacted](./images/you-reacted.png)

</div>

- The other participants see a similar message:

<div align='center'>

![Toast message shown to the other participants](./images/somebody-reacted.png)

</div>

- An animation is displayed over the video for all participants:

<div align='center'>

![Reaction animation over the conference video](./images/conference.png)

</div>

## Configuration

The reactions are configured in [`public/config.json`](./public/config.json), so
no code changes are needed. The plugin reads this file at startup:

```json
{
  "tooltip": "Reactions",
  "ownReactionText": "You",
  "resources": [
    {
      "id": "clap",
      "icon": {
        "main": "/icons/clappingIcon.svg",
        "hover": "/icons/clappingIconHover.svg",
        "text": "Applause"
      },
      "toastIcon": "👏",
      "source": "/animations/clap.gif"
    }
  ]
}
```

- `tooltip`: Tooltip of the reactions button in the toolbar.
- `ownReactionText`: Text shown in the toast message of the user who reacted,
  for example "You 👏".
- `resources`: List of available reactions. Each one has:
  - `id`: Unique identifier of the reaction. It is sent to the other
    participants.
  - `icon.main`: SVG icon of the reaction button.
  - `icon.hover`: SVG icon for the hover state (required, but not currently
    used).
  - `icon.text`: Text shown as the tooltip of the reaction button.
  - `toastIcon`: Emoji shown in the toast messages.
  - `source`: Animation displayed over the video.

The icon and animation paths are relative to the `public/resources` folder.

To add a new reaction, copy the icons and the animation to
`public/resources/icons` and `public/resources/animations`, and add a new entry
to `resources`. All participants must use the same configured reactions to see
each other's reactions.

### Translations

The plugin always reads `config.json`. Translated examples are provided in
[`german_config.json`](./public/german_config.json) and
[`spanish_config.json`](./public/spanish_config.json). To use one of them,
replace the content of `config.json` with it.

> **Note:** Full localization is not supported yet. The plugin does not detect
> the user's language or switch it dynamically: all participants see the texts
> from the single `config.json` deployed with the plugin. Localization is
> planned as a future feature.

## Run for development

- To build the plugin, you need the following versions or higher:

  | NodeJS   | NPM     |
  | -------- | ------- |
  | v20.12.2 | v10.5.0 |

- Install all the dependencies:

  ```bash
  npm i
  ```

- Before starting the dev server, edit the `vite.json` configuration file. The
  following parameters are available:

  - `infinityUrl`: URL of the Pexip Infinity Conferencing Node.
  - `port`: Port used by the development server.
  - `brandingPath`: Path of the branding configured in Infinity.

  Example:

  ```json
  {
    "infinityUrl": "https://pexipdemo.com",
    "port": 5173,
    "brandingPath": "/local-plugin"
  }
  ```

- Start the development server:

  ```bash
  npm start
  ```

The plugin is served from https://localhost:5173 (visit that page and accept the
self-signed certificate), but you should access it through the Web App 3 URL.
For more information about configuring your environment, see the
[Developer Portal: Setup guide for plugin developers](https://developer.pexip.com/docs/plugins/webapp-3/setup-guide-for-plugin-developers).

## Build for production

First, install the dependencies:

```bash
npm i
```

Then create the package:

```bash
npm run build
```

The package is created in the `dist` folder. Next, create a Web App 3 branding
and copy the contents of `dist` into it.

To learn more about deploying plugins in Pexip Infinity, see the
[Developer Portal](https://developer.pexip.com).
