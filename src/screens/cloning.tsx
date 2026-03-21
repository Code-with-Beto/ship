import { useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { useLoadingDots } from "../hooks/use-loading-dots";
import { cloneRepo } from "../utils";
import type { Template } from "../types";

export function CloningScreen({
  template,
  projectName,
  onDone,
  onError,
}: {
  template: Template;
  projectName: string;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const dots = useLoadingDots();

  useEffect(() => {
    cloneRepo(template.repo, projectName).then((result) => {
      if (result.ok) onDone();
      else onError(result.error ?? "Unknown error");
    });
  }, [template.repo, projectName]);

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text attributes={TextAttributes.BOLD}>
          Cloning {template.name} into ./{projectName}{dots}
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>This may take a moment</text>
      </box>
    </ScreenLayout>
  );
}
