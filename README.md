<div align="center">

# 🗺️ Meetify

### *Discover What's Happening Around You*

A real-time, location-based social platform that connects you with people and events in your area through an interactive map experience.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)

</div>

---

## ✨ Features

### 🗺️ Interactive Map Experience
- **Full-screen dark-themed map** with CartoDB tiles
- **Real-time activity markers** showing active places near you
- **Color-coded heat indicators** - Green (Low), Orange (Medium), Red (High activity)
- **Seamless zoom and pan** with smooth interactions

### 💬 Location-Based Chat
- **Join place-specific chatrooms** to connect with others
- **Real-time messaging** with live updates
- **Activity-based discovery** - see where conversations are happening

### 🎨 Modern Glass UI
- **Frosted glass effect** navigation and overlays
- **Smooth animated transitions** between screens
- **Responsive design** that adapts from mobile to desktop
- **Minimal iconography** for a clean, professional look

### 📱 Cross-Platform
- **Web** - Leaflet-powered map with full interactivity
- **iOS** - Native Google Maps integration
- **Android** - Native Google Maps integration

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td align="center"><b>Map View</b></td>
<td align="center"><b>Slide Menu</b></td>
<td align="center"><b>Social Feed</b></td>
</tr>
<tr>
<td><img src="docs/screenshots/map.png" width="250"/></td>
<td><img src="docs/screenshots/menu.png" width="250"/></td>
<td><img src="docs/screenshots/social.png" width="250"/></td>
</tr>
</table>
</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/AntarikshRanjan/meetify-native.git
cd meetify-native

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

```bash
# Web
npx expo start --web

# iOS (requires Xcode)
npx expo start --ios

# Android (requires Android Studio)
npx expo start --android
```

---

## 🏗️ Project Structure

```
meetify-native/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── _layout.tsx      # Tab bar with glass effect
│   │   ├── explore.tsx      # Map view with markers
│   │   ├── social.tsx       # Activity feed
│   │   └── inbox.tsx        # Chat inbox
│   ├── place/[id].tsx       # Place details modal
│   ├── chat/[id].tsx        # Live chat screen
│   └── _layout.tsx          # Root navigation
├── context/
│   └── AppContext.tsx       # Global state management
├── data/
│   ├── types.ts             # TypeScript interfaces
│   └── mock.ts              # Mock data for development
├── assets/                   # App icons and images
└── metro.config.js          # Metro bundler config
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native + Expo |
| **Navigation** | Expo Router |
| **Language** | TypeScript |
| **Web Maps** | Leaflet + React-Leaflet |
| **Native Maps** | react-native-maps |
| **State** | React Context API |
| **Styling** | StyleSheet + Glass Effects |

---

## 🎯 Core Screens

### Explore (Map)
The heart of Meetify - an interactive map showing all active places with:
- Colored markers indicating activity levels
- Search functionality to find specific places
- Tap-to-view place details

### Social Feed
Stay updated with what's happening:
- Real-time posts from places you follow
- Activity timestamps
- Quick navigation to place chats

### Inbox
Your personal chat hub:
- All joined place conversations
- Last message previews
- Activity indicators

### Place Details
Deep dive into any location:
- Live chat with people at the place
- Current plans and events
- Join/leave functionality

---

## 🎨 Design Philosophy

Meetify follows a **dark-first, glass-morphism** design language:

- **Dark backgrounds** (#0a0a0a) reduce eye strain
- **Glass effects** with `backdrop-filter: blur()` create depth
- **Minimal symbols** (◎, ◇, ◌) instead of emoji for professionalism
- **Smooth animations** using React Native Animated API
- **Responsive layouts** that work on any screen size

---

## 🔧 Configuration

### Environment Setup

For native map support, add your Google Maps API key in `app.json`:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_API_KEY_HERE"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_API_KEY_HERE"
        }
      }
    }
  }
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ by [Antariksh Ranjan](https://github.com/AntarikshRanjan)**

*Discover. Connect. Meet.*

</div>
