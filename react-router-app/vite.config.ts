import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";
import autoprefixer from "autoprefixer";
// @ts-expect-error – untyped module
import stylex from "@stylexjs/postcss-plugin";

const depsWithStyles = [
  "library",
];

const babelConfig = {
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
  ],
};

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      babelConfig,
      loader: "jsx",
      filter: /\.[jt]sx?$/u,
    }),
    tsconfigPaths(),
  ],
  css: {
    postcss: {
      plugins: [
        stylex({
          babelConfig,
          useCSSLayers: true,
          include: [
            "./app/**/*.{js,jsx,ts,tsx}",
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
