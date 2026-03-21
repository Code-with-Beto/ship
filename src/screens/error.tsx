import { TextAttributes } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";

export function ErrorScreen({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const renderer = useRenderer();

  const options = onRetry
    ? [
        { name: "Try again", description: "", value: "retry" as const },
        { name: "Exit", description: "", value: "exit" as const },
      ]
    : [{ name: "Exit", description: "", value: "exit" as const }];

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text fg="red" attributes={TextAttributes.BOLD}>
          Something went wrong
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text fg="red">{message}</text>
      </box>
      <SelectMenu
        options={options}
        onSelect={(value) => {
          if (value === "retry" && onRetry) onRetry();
          else renderer.destroy();
        }}
      />
    </ScreenLayout>
  );
}
