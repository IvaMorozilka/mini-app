# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Моя дока, как с этим работать

Во первых, установлена библиотека компонентов Max. [Документация по компонентам здесь](https://dev.max.ru/ui)

Как начать работать?

1. Открыть папку frontend в VSCode
2. Выполнить команду ```npm install``` - установку пакетов из корня
3. Запуск проекта ```npm run dev```
4. Перейти по ссылке в консоли. Изменения в файлах сразу отображаются на сайте

## Структура проекта

**assets/**: _Для статичных ресурсов, например, изображения, шрифты или иконки._

**components/**: _Содержит переиспользуемые UI-компоненты, такие как кнопки, поля ввода, модальные окна и т.д. Эти компоненты не должны содержать сложной бизнес-логики._

**hooks/**: _Для кастомных React-хуков, которые могут быть использованы в разных частях приложения._

**lib/**: _Для интеграции со сторонними сервисами и API, например, настройка Axios или Firebase._

**views/**: _Здесь располагаются компоненты, отвечающие за отдельные страницы вашего приложения (например, HomePage.tsx, AboutPage.tsx)._

**router/**: _Конфигурация маршрутизации вашего приложения. Часто для этого используется библиотека react-router-dom._

**styles/**: _Глобальные стили, переменные CSS или темы оформления.

**utils/**: _Вспомогательные функции, которые могут использоваться в разных частях проекта._

**App.tsx**: _Корневой компонент приложения._

**main.tsx**: _Точка входа в ваше приложение, где происходит рендеринг корневого компонента._
