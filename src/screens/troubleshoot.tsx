import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";

export function TroubleshootScreen({
  onRetry,
  onGoToPage,
}: {
  onRetry: () => void;
  onGoToPage: () => void;
}) {
  const options = [
    {
      name: "Try again",
      description: "Re-check GitHub access",
      value: "retry" as const,
    },
    {
      name: "Take me to the Platano page",
      description: "Open in browser",
      value: "page" as const,
    },
  ];

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text attributes={TextAttributes.BOLD}>Troubleshooting</text>
      </box>
      <box
        flexDirection="column"
        marginTop={1}
        marginLeft={4}
        marginRight={4}
      >
        <text>Make sure you:</text>
        <text attributes={TextAttributes.DIM}>
          {" "}1. Are logged into GitHub (run: gh auth login)
        </text>
        <text attributes={TextAttributes.DIM}>
          {" "}2. Your account is part of the Code-with-Beto org
        </text>
        <text attributes={TextAttributes.DIM}>
          {" "}3. Or you have direct access to the Platano repo
        </text>
      </box>
      <SelectMenu
        options={options}
        onSelect={(value) => {
          if (value === "retry") onRetry();
          else onGoToPage();
        }}
      />
    </ScreenLayout>
  );
}
