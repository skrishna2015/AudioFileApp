# AudioFileApp

A React Native mobile application built with Expo for managing and playing audio files. This app allows users to import, organize, and play audio files with a clean and intuitive interface.

## Features

- Import audio files from your device
- Organize audio files into customizable categories
- Audio playback with play, pause, seek, and volume controls
- Background audio playback support
- Save favorite audio files for quick access
- Clean and responsive UI with tab-based navigation

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/skrishna2015/AudioFileApp.git
   cd AudioFileApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on a device or emulator:
   - Scan the QR code with the Expo Go app
   - Press 'a' to run on Android emulator
   - Press 'i' to run on iOS simulator

## Building for Production

### Android APK

To build an Android APK:

```bash
eas build -p android --profile preview
```

For a production build:

```bash
eas build -p android --profile production
```

### iOS

To build for iOS:

```bash
eas build -p ios --profile preview
```

For a production build:

```bash
eas build -p ios --profile production
```

## Project Structure

```
AudioFileApp/
├── .expo/               # Expo configuration
├── .qodo/               # Project-specific configuration
├── .vscode/             # VS Code settings
├── app/                 # Main app directory
│   ├── (tabs)/          # Tab-based navigation structure
│   │   ├── (audio)/     # Audio-related screens
│   │   ├── (files)/     # File management screens
│   │   ├── _layout.js   # Layout configuration for tabs
│   │   ├── index.js     # Main tab screen
│   ├── assets/          # Static assets like icons and images
│   ├── _layout.js       # Root layout configuration
│   ├── index.js         # App entry point
├── node_modules/        # Dependencies
├── .gitignore           # Git ignore configuration
├── App.js               # Main App component
├── app.json             # Expo configuration
├── ASSIGNMENT.pdf       # Project assignment details
├── babel.config.js      # Babel configuration
├── eas.json             # EAS Build configuration
├── index.js             # JS entry point
├── package-lock.json    # Dependency lock file
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

## App Flow

1. **Initial Launch**
   - App loads with splash screen
   - Checks for permissions (audio, file storage)
   - Redirects to main tab navigation

2. **Home Tab** (`app/(tabs)/index.js`)
   - Dashboard with overview of audio files
   - Recently played audio files
   - Quick access buttons for common actions
   - Navigation to other tabs

3. **Audio Tab** (`app/(tabs)/(audio)/`)
   - Browse and manage audio files
   - Playback controls for selected audio
   - Organize audio files into categories
   - Favorite/unfavorite functionality

4. **Files Tab** (`app/(tabs)/(files)/`)
   - File browser for audio files
   - Import new audio files
   - Delete or move files
   - View file details and metadata

5. **Import Flow**
   - User navigates to Files tab
   - Selects import option
   - Document picker opens for file selection
   - Files are copied to app storage
   - Metadata is extracted and saved

6. **Playback Flow**
   - User selects audio file from any tab
   - Audio player controls appear
   - Shows playback controls (play/pause, seek, volume)
   - Continues playing in background while navigating tabs

## Technologies

- React Native
- Expo
- Expo Router for file-based navigation
- Expo AV for audio playback
- Expo Document Picker for file selection
- AsyncStorage for local data persistence
- Expo File System for file management
- React Navigation (Bottom Tabs)

## License

This project is licensed under the 0BSD License.

## Links

- GitHub: [https://github.com/skrishna2015/AudioFileApp](https://github.com/skrishna2015/AudioFileApp)