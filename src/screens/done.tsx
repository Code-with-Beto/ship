import { useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { ScreenLayout } from "../components/screen-layout";
import type { OnboardingResult } from "../types";

export function DoneScreen({
  projectName,
  onboardingResult,
}: {
  projectName: string;
  onboardingResult: OnboardingResult;
}) {
  const renderer = useRenderer();

  useEffect(() => {
    const timeout = setTimeout(() => renderer.destroy(), 8000);
    return () => clearTimeout(timeout);
  }, []);

  const { appName, slug, bundleId, payments } = onboardingResult;

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text fg="green" attributes={TextAttributes.BOLD}>
          ✔ Created {appName} at ./{projectName}
        </text>
      </box>
      <box flexDirection="column" marginTop={1} marginLeft={4}>
        <text>
          {"  "}Name:{"        "}
          {appName}
        </text>
        <text>
          {"  "}Slug:{"        "}
          {slug}
        </text>
        <text>
          {"  "}Bundle ID:{"   "}
          {bundleId}
        </text>
        <text>
          {"  "}Payments:{"    "}
          {payments ? "enabled (test store)" : "disabled"}
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>
          Everything is configurable in src/config/app.ts.
        </text>
      </box>
      <box flexDirection="column" marginTop={1} marginLeft={4}>
        <text>Next steps:</text>
        <text attributes={TextAttributes.DIM}>{"  "}cd {projectName}</text>
        <text attributes={TextAttributes.DIM}>{"  "}npx expo start</text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>
          Happy shipping! Need help? https://cwb.sh/discord
        </text>
      </box>
    </ScreenLayout>
  );
}
