import { useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { ScreenLayout } from "../components/screen-layout";

export function DoneScreen({ projectName }: { projectName: string }) {
  const renderer = useRenderer();

  useEffect(() => {
    const timeout = setTimeout(() => renderer.destroy(), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text fg="green" attributes={TextAttributes.BOLD}>
          ✓ Your project is ready!
        </text>
      </box>
      <box flexDirection="column" marginTop={1} marginLeft={4}>
        <text>Get started:</text>
        <text attributes={TextAttributes.DIM}>{" "}cd {projectName}</text>
        <text attributes={TextAttributes.DIM}>{" "}bun install</text>
        <text attributes={TextAttributes.DIM}>{" "}bun start</text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>Happy shipping! 🚀</text>
      </box>
    </ScreenLayout>
  );
}
