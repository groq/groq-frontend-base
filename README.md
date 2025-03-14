# groq-frontend-base

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)  

> **A Next.js template that integrates Groq API, Tailwind CSS, ShadCN UI, and a chat completion feature with both server-side and client-side components.**  

![Demo](public/demo.gif)


This repository serves as a **base project** for creating a frontend application that communicates with the Groq API. It's pre-configured with a modern stack to help you get up and running quickly.

---

## Table of Contents

- [groq-frontend-base](#groq-frontend-base)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [1. Clone or Use This Template](#1-clone-or-use-this-template)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Set Up Environment Variables](#3-set-up-environment-variables)
    - [4. Run the Development Server](#4-run-the-development-server)
    - [5. Customize for your project](#5-customize-for-your-project)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Development Workflow](#development-workflow)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- **Next.js (TypeScript)** – A popular React framework for production-grade apps.
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development.
- **ShadCN UI** – A design system built on top of Radix UI and Tailwind.
- **Biome.js** – For code formatting, linting, and general code quality improvements.
- **Server-side Chat Completion** – Use the Groq API for server-side chat logic.
- **Client-side Chat Hook** – A React hook to handle client-side chat completion logic.

---

## Getting Started

### 1. Clone or Use This Template

You can clone the repository:

```bash
git clone https://github.com/your-username/groq-frontend-base.git
cd groq-frontend-base
```

Or click the **"Use this template"** button on GitHub to create a new repository from this template.

Alternatively, you can **deploy directly to Vercel** by clicking the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=Next.js%20template%20integrating%20Groq%20API%2C%20Tailwind%20CSS%2C%20and%20ShadCN%20UI%20with%20chat%20completion%20and%20both%20server-side%20%26%20client-side%20components.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2Q8bQ6hZECKH4ZSYnMbTko%2Fbdb7e2ce90eca75f4535713f42da595e%2Fscreenshot.png&demo-title=Groq%20Starter&demo-url=https%3A%2F%2Ffrontend-base.groqlabs.com%2F&from=templates&products=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522protocol%2522%253A%2522ai%2522%252C%2522productSlug%2522%253A%2522api-key%2522%252C%2522integrationSlug%2522%253A%2522groq%2522%257D%255D&project-name=Groq%20Starter&repository-name=groq-starter&repository-url=https%3A%2F%2Fgithub.com%2Fgroq%2Fgroq-frontend-base&skippable-integrations=1)

### 2. Install Dependencies

This project uses [pnpm](https://pnpm.io/). To install dependencies:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example environment file and add your Groq API key:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` to add your API key from https://console.groq.com/keys

```bash
GROQ_API_KEY=your_api_key
```

### 4. Run the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Customize for your project

- Start your journey at `src/app/page.tsx`.
- Customize the prompts or tools as needed.
- Take a quick look at how `src/app/components/chat-component.tsx` is implemented.
- Use the hooks in `src/hooks/use-completion.ts` and `src/hooks/use-completion-tools.ts` to customize the chat completion logic.
- Have fun!

*(Adjust as needed if you're deploying to a service like Vercel or Netlify.)*

---

## Project Structure

A quick look at the top-level files and directories you'll see in this project:

```
.
├── public/                # Static assets
├── src/                   
│   ├── app/               # Next.js App Router
│   │     ├── api/         # Implements Groq-API server-side chat completion
│   │     └── page.tsx     # Uses the chat completion hook
│   ├── components/        # Shared components
│   ├── hooks/             # React hooks (including chat completion hook)
│   ├── lib/               # Basic utility functions
│   └── providers/         # Providers folder. Includes theme-provider
├── .env.local             # Environment variables (not committed)
└── (config files)
```

---

## Environment Variables

The project expects the following environment variable in `.env.local`:

```bash
GROQ_API_KEY=your_api_key_here
```

- **GROQ_API_KEY**: Used to authenticate requests to the Groq API. Make sure not to commit this key to a public repository.

---

## Development Workflow

1. **Pull requests**: Open a PR for any feature or fix.  
2. **Lint & format**: This project uses Biome.js, which can be run via `pnpm biome lint`.  
3. **Commits**: Use clear commit messages (e.g., [Conventional Commits](https://www.conventionalcommits.org/)) if preferred.  

---

## Contributing

Contributions are welcome! Please open issues for feature requests or bug reports.  
1. Fork this repository  
2. Create a new branch for your feature/fix  
3. Commit your changes  
4. Open a pull request against the `main` branch  

For major changes, please discuss with the maintainers via GitHub issues first to ensure they align with the project roadmap.

---

## License

This project is licensed under the [MIT License](LICENSE). You're free to use and modify this code for your own purposes.  

---

*Happy coding! If you have any questions or feedback, feel free to open an issue.*