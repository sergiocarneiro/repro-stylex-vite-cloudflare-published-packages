# StyleX + Vite + Cloudflare Workers: Published Package Compilation Issue

This repository demonstrates a specific issue where **StyleX definitions from published packages are not being compiled** when using Vite with the `@cloudflare/vite-plugin`, causing runtime errors.

## The Problem

When importing and using StyleX styles from external packages (simulated here via `file:` protocol) **in development mode**, the StyleX Babel plugin fails to compile the imported styles, resulting in:

```
Unexpected 'stylex.create' call at runtime. Styles must be compiled by '@stylexjs/babel-plugin'.
```

**Key findings:**
- StyleX definitions from external packages fail to compile in development mode only
- Production builds (`npm run build` + `npm run preview`) work correctly
- Local StyleX definitions in the app compile correctly on both dev and build
- Issue is specific to Cloudflare Workers setup (other Vite setups work fine)

## Steps to Reproduce

1. **Install dependencies**
   ```
   npm install
   ```

2. **Start the development server**
   ```
   cd app
   npm run dev
   ```

3. **Navigate to the application**
   - Open `http://localhost:5173` in your browser
   - **Expected**: The page should render with a green title
   - **Actual**: You'll see a StyleX runtime error: `Unexpected 'stylex.create' call at runtime`

### Diagnostic Steps

1. **Verify production build works correctly**
   ```
   cd app
   npm run build
   npm run preview
   ```
   - Navigate to the preview URL
   - Observe the app renders without errors (external StyleX styles work correctly, title is green)

2. **Confirm local styles work in development**
   - Ensure the development server is running (`npm run dev` from step 2 above)
   - Comment line 13 in `app/app/routes/home.tsx` (`color: colors.green`) *— to remove the use of external styles*
   - Refresh the browser at `http://localhost:5173`
   - Observe the app renders without errors

## Key Files

- [`app/src/App.tsx`](./app/src/App.tsx) - The main React component that uses StyleX both locally and from the library
- [`app/vite.config.ts`](./app/vite.config.ts) - Vite configuration that compiles StyleX using Babel and PostCSS
- [`library/src/index.ts`](./library/src/index.ts) - A `stylex.create` definition
- [`library/src/tokens.stylex.ts`](./library/src/tokens.stylex.ts) - A `stylex.defineVars` definition

## Project Structure

This reproduction consists of **isolated packages** that simulate real-world usage patterns:

```
app/                     # Main application (React Router + Vite + Cloudflare)
├── app/routes/home.tsx  # Component that imports StyleX from library
├── vite.config.ts       # Vite config with StyleX + Cloudflare setup
└── package.json         # Depends on library via file: protocol
library/                 # External package with StyleX definitions
├── src/index.ts         # Exports stylex.create() styles
├── src/tokens.stylex.ts # Exports stylex.defineVars() tokens
react-app/               # Working comparison (Vite without Cloudflare)
react-router-app/        # Working comparison (React Router without Cloudflare)
```

### Comparison Apps

To isolate the issue, additional test applications are included:

- **`react-app/`** - Basic React + Vite (**works**)
- **`react-router-app/`** - React Router + Vite (**works**)
- **`app/`** - React Router + Vite + Cloudflare (**fails**)

This confirms the issue is specifically related to the `@cloudflare/vite-plugin` interaction.

## Technical Analysis

The issue appears to be related to how the `@cloudflare/vite-plugin` affects the module resolution and compilation pipeline **during development**, preventing the StyleX Babel plugin from processing imported styles from external packages. Interestingly, the production build process works correctly, suggesting the issue is specific to Vite's development server behavior when combined with the Cloudflare plugin.

**Possible causes:**
- Development-specific module bundling behavior differences with Cloudflare plugin
- Different handling of `node_modules` dependencies in dev vs. build modes
- HMR (Hot Module Replacement) conflicts with StyleX compilation
- Dev server file inclusion/exclusion pattern issues
- SSR compilation pipeline differences between dev and build modes

## Environment

**Key Dependencies:**
- `@cloudflare/vite-plugin`: `^1.10.0`
- `@stylexjs/babel-plugin`: `^0.14.2`
- `@stylexjs/postcss-plugin`: `^0.14.2`
- `react-router`: `^7.7.0`
- `vite`: `^6.0.7`

**Node.js:** Any recent version (tested with v18+)
