import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";

export function TroubleshootScreen({
  onRetry,
  onGoToPage,
  onBack,
}: {
  onRetry: () => void;
  onGoToPage: () => void;
  onBack: () => void;
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
    {
      name: "← Go back",
      description: "",
      value: "back" as const,
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
          {" "}1. Used the same GitHub account you signed up with
        </text>
        <text attributes={TextAttributes.DIM}>
          {" "}2. Your account has been added to the Code-with-Beto org
        </text>
        <text attributes={TextAttributes.DIM}>
          {" "}3. Check your email for a GitHub org invite you may need to accept
        </text>
      </box>
      <SelectMenu
        options={options}
        onSelect={(value) => {
          if (value === "retry") onRetry();
          else if (value === "page") onGoToPage();
          else onBack();
        }}
      />
    </ScreenLayout>
  );
}
