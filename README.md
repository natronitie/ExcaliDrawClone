# ExcaliDrawClone
 
A multiplayer virtual whiteboard with real-time collaboration and Turborepo-powered build caching. Inspired by Excalidraw, built from scratch as a learning/portfolio project.
 
---
 
## ✨ Features
 
- 🖊️ **Canvas drawing** — freehand sketching on a shared virtual board
- 🌐 **Multiplayer** — real-time collaboration with multiple users on the same board
- ⚡ **Turborepo caching** — fast incremental builds across the monorepo
- 🏗️ **Monorepo architecture** — cleanly separated apps and shared packages
- 🔷 **TypeScript** — fully typed codebase (~93% TypeScript)
---
 
## 🗂️ Project Structure
 
```
ExcaliDrawClone/
├── apps/
│   ├── web/          # Main Next.js frontend (the whiteboard app)
│   └── docs/         # Documentation Next.js app
├── packages/
│   ├── ui/           # Shared React component library
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared tsconfig.json files
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Monorepo | Turborepo |
| Package Manager | pnpm |
| Linting | ESLint + Prettier |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- **Node.js** >= 18
- **pnpm** >= 9.0.0
Install pnpm if you don't have it:
 
```bash
npm install -g pnpm
```
 
### Installation
 
```bash
git clone https://github.com/natronitie/ExcaliDrawClone.git
cd ExcaliDrawClone
pnpm install
```
 
### Development
 
Run all apps and packages in development mode:
 
```bash
pnpm dev
```
 
The main app will be available at `http://localhost:3000`.
 
### Build
 
Build all apps and packages:
 
```bash
pnpm build
```
 
Turborepo handles dependency order automatically and caches outputs for fast rebuilds.
 
---
 
## 📦 Packages
 
### `apps/web`
The main whiteboard frontend. Built with Next.js. Handles the canvas UI, drawing tools, and real-time multiplayer sync.
 
### `apps/docs`
Documentation site. Also a Next.js app.
 
### `packages/ui`
Shared React component library used by both `web` and `docs`. Keeps UI components DRY across the monorepo.
 
### `packages/eslint-config`
Shared ESLint config (includes `eslint-config-next` and `eslint-config-prettier`).
 
### `packages/typescript-config`
Shared `tsconfig.json` base configurations used across all apps and packages.
 
---
 
## ⚙️ Turborepo Remote Caching (Optional)
 
By default, Turbo caches locally. You can enable remote caching via Vercel for shared CI/CD cache:
 
```bash
npx turbo login
npx turbo link
```
 
This lets your team share build artifacts across machines.
 
---
 
## 🤝 Contributing
 
Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.
 
---
 
## 📄 License
 
This project is open source. See [LICENSE](./LICENSE) for details.
 
