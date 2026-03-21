import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";

function App() {
  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      border={true}
      borderColor={"yellow"}
      borderStyle="heavy"
    >
      <box justifyContent="center" alignItems="flex-end">
        <text>🍌</text>
        <ascii-font font="tiny" text="Code with Beto" />
        <text attributes={TextAttributes.DIM}>Make apps happen!</text>
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
