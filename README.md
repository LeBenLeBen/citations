# Citations

A Vue app displaying quotes from a Firebase Firestore database.

## Project setup

After cloning the repository, run the following command within the project folder to install dependencies:

```bash
npm install
```

While it installs, duplicate the file `.env.local.example` as `.env.local`:

```bash
cp .env.local.example .env.local
```

Then edit this file and add at least your **Firebase project ID** and **API key**. If you don’t have those already, go to [firebase.google.com](https://firebase.google.com/), create an account and then create a project. The credentials can be found in the project settings.

### Enable Authentication

In your Firebase console, you need to enable at least one authentication method for your project to be able to sign in within the app.

Disclaimer: the app was designed and tested only with Google authentication.

### Enable Database

This app use the “Cloud Firestore” database to store the quotes, ensure it’s enabled in your Firebase console for your project.

You are free to configure the access rules as you whish, but if you are too restrictive you might not be able to read/write from the app. Check your browser console for potential denied access errors.

You don’t have to setup any database collection manually, they will be created when you add the first quote from the app.

## Compiles and hot-reloads for development

```bash
npm start
```

## Compiles and minifies for production

```bash
# Build for production
npm run build

# Build with "dev" environment variables (defined in .env.dev.local)
# See https://cli.vuejs.org/guide/mode-and-env.html
npm run build -- --mode dev
```

## Lints and fixes files

```bash
npm run lint
```

## Deploy

You need the Firebase cli installed (`npm i -g firebase-tools`).

⚠️ Don’t forget to build your app first, see above.

```bash
# Projects are defined in the `.firebaserc`

# Deploy the "default" project
firebase deploy

# Deploy the "prod" project
firebase -P prod deploy
```
