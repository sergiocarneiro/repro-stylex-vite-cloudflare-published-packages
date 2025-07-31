import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { sharedStyles } from "library";
import { colors } from "library/tokens.stylex";

const styles = stylex.create({
  root: {
    padding: "16px",
    fontFamily: "system-ui",
  },
  title: {
    marginBottom: 0,
    color: colors.green,
  },
  subtitle: {
    fontSize: "1rem",
  },
});

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main {...stylex.props(styles.root)}>
      <h1 {...stylex.props(styles.title)}>
        StyleX + Vite
      </h1>
      <h2 {...stylex.props(styles.subtitle)}>
        Published Packages Issue Reproduction
      </h2>
      <br />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </main>
  )
}
