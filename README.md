# UP Bank – Banking Simulation Web App

Welcome to **UP Bank**, a web-based simulation of a modern digital bank. This project was built as a mock banking platform that allows users to perform transactions and explore various banking features in a secure and interactive environment.

## Features

- **User Account Management**  
  Create, log in, and manage user accounts with simulated balances and activity history.

- **Transactions**  
  Transfer funds between users, simulate deposits and withdrawals, and track transaction history.

- **Dashboard Overview**  
  View real-time account data, including balance, recent activity, and transaction insights.

- **Secure Simulation**  
  All sensitive operations are handled securely in this simulation environment (no real money involved).

- **Responsive Design**  
  Fully responsive and optimized for desktop devices.

## Tech Stack
- This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.
- Also Node.js was used. Download and install it from https://nodejs.org/en

## Installation

```bash
# Clone the repository
git clone https://github.com/andreslomelig/UpBank.git
cd UpBank

```

## Development server

### Backend

First you will need to setup the backend, run:

```bash
cd UpBankBackend # Go to the backend folder
npm init -y
npm install express cors sqlite3 body-parser
```

To run the backend development server, type:
```bash
cd UpBankBackend # Go to the backend folder
node index.js
```

Once the server is running, notice it will be hosted in `http://localhost:3000/`.  There is no need for you to open it in your browser, it is just for you to know the port of the backend server.

### Frontend

First you will need to setup the frontend, run:

```bash
cd UpBankWeb # Go to the frontend folder
npm install
```

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

NOTE: Make sure you are running the backend simultaneously !!

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

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

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
