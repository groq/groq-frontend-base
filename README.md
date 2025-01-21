
# groq-frontend-base

This is a base project for a frontend application that uses the Groq API.

## How to use it

### 1. Clone the repository

### 2. Install the dependencies
```
pnpm i
```     

### 3. Run the development server
```
pnpm dev
```

### 4. Make sure you have a valid API Key

- It will use `GROQ_API_KEY` from the environment variables.
- You can also define it in `/.env.local` file:

### 5. Start Cooking!

- Take a look to `/src/app/` to make the app your own.

```
# GROQ_API_KEY must be secret and not shared with anyone.
GROQ_API_KEY=your_api_key
```

## Steps we followed to create this project (Stack)

- [x] Create next.js project (typescript, tailwindcss)
- [x] Add biome.js
- [x] Add shadcn ui
- [x] Add shadcn Dark mode
- [x] Add server side chat completion
- [x] Add client side chat completion react hook

