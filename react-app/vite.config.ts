import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { BabelOptions } from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import babel from "vite-plugin-babel";
// @ts-expect-error – untyped module
import stylex from "@stylexjs/postcss-plugin";

const depsWithStyles = [
  "library",
];

const babelConfig: BabelOptions = {
  babelrc: false,
  configFile: false,
  presets: ["@babel/preset-typescript"],
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: process.env.NODE_ENV === "development",
        test: process.env.NODE_ENV === "test",
        runtimeInjection: false,
        genConditionalClasses: true,
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: "commonJS",
        },
      },
    ],
    {
      name: "file-logger",
      visitor: {
        Program(_programPath: any, state: any)
        {
          const relativePath = state.filename.replace(process.cwd(), "");
          console.log(`- ${relativePath}`);
        }
      }
    },
  ],
};

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig,
      loader: "jsx",
      filter: /\.[jt]sx?$/u,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        stylex({
          babelConfig,
          useCSSLayers: true,
          include: [
            "./src/**/*.{js,jsx,ts,tsx}",
            ...depsWithStyles.map(
              (dep) => `./node_modules/${dep}/build/**/*.{js,jsx,ts,tsx}`
            ),
          ],
        }),
        autoprefixer(),
      ],
    },
  },
  ssr: {
    noExternal: depsWithStyles,
  },
});
