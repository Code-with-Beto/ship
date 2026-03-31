import { useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { useLoadingDots } from "../hooks/use-loading-dots";
import { configureProject } from "../configure";
import type { OnboardingResult } from "../types";

export function ConfiguringScreen({
  projectName,
  onboardingResult,
  onDone,
  onError,
}: {
  projectName: string;
  onboardingResult: OnboardingResult;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const dots = useLoadingDots();

  useEffect(() => {
    configureProject(projectName, onboardingResult).then((result) => {
      if (result.ok) onDone();
      else onError(result.error ?? "Unknown error");
    });
  }, [projectName]);

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text attributes={TextAttributes.BOLD}>
          Setting things up{dots}
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>
          Personalizing files and installing dependencies
        </text>
      </box>
    </ScreenLayout>
  );
}
