# QA Native App

A React Native Q&A community application with full internationalization support.

## Features

- 📱 Cross-platform (iOS & Android)
- 🌍 Full internationalization (Chinese & English)
- 💬 Q&A community features
- 🏆 Wisdom index and exam system
- 👥 Team collaboration
- 🎯 Activity management
- 💰 Reward system

## Internationalization (i18n)

This app supports multiple languages with automatic language detection based on device settings.

### Supported Languages

- **Chinese (zh)** - 简体中文
- **English (en)** - Default fallback language

### How It Works

The app uses a custom i18n system built with:
- `SimpleI18n` class for translation management
- `useTranslation` hook for React components
- `expo-localization` for automatic language detection
- JSON translation files organized by feature modules

### Language Detection

The app automatically detects your device's system language:
- Chinese (zh, zh-CN, zh-TW, etc.) → Uses Chinese translations
- English (en, en-US, en-GB, etc.) → Uses English translations
- Other languages → Falls back to English

### Translation File Structure

Translation keys are organized by feature modules:

```
src/i18n/locales/
├── zh.json  # Chinese translations
└── en.json  # English translations
```

Key naming convention:
- **Pages**: `screens.{pageName}.{key}`
- **Components**: `components.{componentName}.{key}`
- **Common**: `common.{key}`

Example:
```javascript
import { useTranslation } from '../i18n/withTranslation';

function MyScreen() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('screens.myScreen.title')}</Text>
  );
}
```

### Utility Functions

#### Time Formatting
```javascript
import { formatTime } from '../utils/timeFormatter';

// Automatically formats time based on current language
const timeText = formatTime(timestamp); // "2小时前" or "2 hours ago"
```

#### Number Formatting
```javascript
import { formatNumber, formatCurrency } from '../utils/numberFormatter';

const views = formatNumber(25600); // "2.56万" or "25.6K"
const price = formatCurrency(99.99); // "$99.99"
```

### Contributing Translations

See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md) for detailed instructions on how to contribute translations.

## Development

### Prerequisites

- Node.js 14+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.js
```

### Translation Validation

```bash
# Validate translation file structure
node scripts/validate-translations.js

# Find unused translation keys
node scripts/find-unused-keys.js

# Analyze translation text lengths
node scripts/analyze-translation-lengths.js
```

## Project Structure

```
src/
├── components/       # Reusable components
├── screens/          # Screen components
├── i18n/            # Internationalization
│   ├── index.js     # SimpleI18n class
│   ├── withTranslation.js  # useTranslation hook
│   └── locales/     # Translation files
├── utils/           # Utility functions
└── navigation/      # Navigation configuration
```

## License

[Your License Here]
