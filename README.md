# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# SafeEmergency App ✳️

SafeEmergency is a high-performance React Native mobile application designed for real-time emergency assistance. This project focuses on rapid response through an intuitive UI, featuring voice-mode situation description, secure user authentication, and a triage-to-guidance emergency flow.

## 🚀 Project Status: Core Navigation & UI Complete

The foundational architecture is now fully implemented using **Expo Router** (File-based routing) and a professional **Atomic Design** structure.

### ✅ Implemented Features

- **Authentication Flow:** Fully functional navigation between Landing, Sign Up, and Login, with persisted sessions.
- **Modern UI/UX:** Styled according to Figma specifications using the Emerald Green (#10B981) theme.
- **Emergency Flow:** Center voice trigger, yes/no triage chat, and protocol guidance screen.
- **Safe Navigation:** Integrated `react-native-safe-area-context` to ensure UI compatibility across all mobile notches and status bars.

## 📂 Project Structure

To keep the code clean and scalable, I have implemented a dual-layer structure:

- **`app/`**: Handles the routing logic. This is where the app's "pages" are defined.
- **`components/`**: Reusable screen-level UI and flow screens.
- **`constants/`**: Shared app data such as API config and protocol steps.
- **`GUIDE.md`**: Architecture reference for the emergency flow and product rules.

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Router:** Expo Router (v3+)
- **Icons:** Expo Vector Icons (Ionicons, FontAwesome)
- **Language:** JavaScript / TypeScript

## ⚙️ How to Run

If you are a team member pulling this repo for the first time:

1.  **Clone the repo:**
    ```bash
    git clone [your-repo-link]
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npx expo start -c
    ```
4.  Open the **Expo Go** app on your phone and scan the QR code.

---

_Developed as part of the Data Science Final Year Project at Kigali Independent University (ULK)._
