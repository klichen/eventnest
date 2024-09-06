export default {
  name: "EventNest",
  slug: "event-nest",
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
    "supportsTablet": false
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
      versionCode: 2
    },
    splash: {
      backgroundColor: "#ffffff"
    },
    ios: {
      bundleIdentifier: "com.uoftevents",
      config: {
        usesNonExemptEncryption: false
      }
    },
  },
};
