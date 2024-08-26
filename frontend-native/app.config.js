export default {
  name: "frontend-native",
  slug: "frontend-native",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    "supportsTablet": true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    env: process.env.ENV,
  },
  expo: {
    extra: {
      eas: {
        projectId: "966c2759-0bfa-4500-b97f-5187b4ae95e0"
      }
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true
          },
        },
      ],
    ],
    updates: {
      url: "https://u.expo.dev/966c2759-0bfa-4500-b97f-5187b4ae95e0"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    android: {
      package: "com.clubclubgo.eventnest",
      versionCode: 1
    },
    splash: {
      backgroundColor: "#ffffff"
    }
  },
};
