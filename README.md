# HoneyMoney

A modern income and expense tracking application built with Angular and Node.js.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Project Structure

This is a full-stack application:

- **Frontend**: Angular 21 with PrimeNG and Tailwind CSS (in `/src`)
- **Backend**: Node.js + Express + MongoDB (in `/backend`)

## Setup

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

   - Copy `.env.example` to `.env`
   - For local development, the default MongoDB URI (`mongodb://localhost:27017/honeymoney`) will work if you have MongoDB installed locally
   - For cloud deployment, sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available) and update the `MONGODB_URI` in `.env`

4. Start the backend server:

```bash
npm run dev
```

The API will run on `http://localhost:3000`

### Frontend Setup

1. Return to the root directory and install dependencies:

```bash
cd ..
npm install
```

2. Start the development server:

```bash
npm start
```

The application will run on `http://localhost:4200`

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

**Note**: Make sure the backend server is also running on port 3000 for the application to work properly.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
