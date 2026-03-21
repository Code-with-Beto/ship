import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";
import type { Template } from "../types";
import { TEMPLATES } from "../types";

export function WelcomeScreen({
  onSelect,
}: {
  onSelect: (template: Template) => void;
}) {
  const options = TEMPLATES.map((t) => ({
    name: t.name,
    description: t.description,
    value: t,
  }));

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.BOLD}>
          Scaffold production-ready apps in seconds.
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>What do you want to ship?</text>
      </box>
      <SelectMenu options={options} onSelect={onSelect} />
    </ScreenLayout>
  );
}
