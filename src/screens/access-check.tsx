import { useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { useLoadingDots } from "../hooks/use-loading-dots";
import { checkGitAccess } from "../utils";
import type { Template } from "../types";

export function AccessCheckScreen({
  template,
  onSuccess,
  onFailure,
}: {
  template: Template;
  onSuccess: () => void;
  onFailure: () => void;
}) {
  const dots = useLoadingDots();

  useEffect(() => {
    checkGitAccess(template.repo).then((hasAccess) => {
      if (hasAccess) onSuccess();
      else onFailure();
    });
  }, [template.repo]);

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text attributes={TextAttributes.BOLD}>
          Checking GitHub access{dots}
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>
          Verifying you have access to {template.name}
        </text>
      </box>
    </ScreenLayout>
  );
}
