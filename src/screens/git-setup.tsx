import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";
import type { GitDiagnosisStatus } from "../utils";

interface SetupInfo {
  title: string;
  lines: { text: string; bold?: boolean }[];
}

const SETUP_INFO: Partial<Record<GitDiagnosisStatus, SetupInfo>> = {
  "no-git": {
    title: "Git is not installed",
    lines: [
      { text: "Git is required to download the template." },
      { text: "" },
      { text: "Install from:  https://git-scm.com/downloads" },
      { text: "" },
      { text: "On macOS you can also run:" },
      { text: "  xcode-select --install", bold: true },
    ],
  },
  "no-gh": {
    title: "GitHub CLI (gh) is not installed",
    lines: [
      { text: "The GitHub CLI is needed to authenticate with" },
      { text: "GitHub and download private templates." },
      { text: "" },
      { text: "Install from:  https://cli.github.com" },
      { text: "" },
      { text: "On macOS with Homebrew:" },
      { text: "  brew install gh", bold: true },
      { text: "" },
      { text: "Learn more:  https://github.com/Code-with-Beto/ship" },
      { text: "" },
      { text: "Still having issues? Try cloning the project directly:" },
      { text: "  https://github.com/Code-with-Beto/platano" },
    ],
  },
  "gh-not-authenticated": {
    title: "Not logged into GitHub",
    lines: [
      { text: "Run this command in another terminal:" },
      { text: "" },
      { text: "  gh auth login", bold: true },
      { text: "" },
      { text: "Then come back and select \"Try again\"." },
    ],
  },
  "git-credential-issue": {
    title: "Git can't access GitHub",
    lines: [
      { text: "You're logged into GitHub CLI, but git isn't" },
      { text: "using those credentials yet." },
      { text: "" },
      { text: "Run this command in another terminal:" },
      { text: "" },
      { text: "  gh auth setup-git", bold: true },
      { text: "" },
      { text: "Then come back and select \"Try again\"." },
    ],
  },
};

export function GitSetupScreen({
  status,
  onRetry,
  onBack,
}: {
  status: GitDiagnosisStatus;
  onRetry: () => void;
  onBack: () => void;
}) {
  const info = SETUP_INFO[status];
  if (!info) return null;

  const options = [
    {
      name: "Try again",
      description: "Re-check after setup",
      value: "retry" as const,
    },
    {
      name: "\u2190 Go back",
      description: "",
      value: "back" as const,
    },
  ];

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text fg="yellow" attributes={TextAttributes.BOLD}>
          {info.title}
        </text>
      </box>
      <box
        flexDirection="column"
        marginTop={1}
        marginLeft={4}
        marginRight={4}
      >
        {info.lines.map((line, i) => (
          <text
            key={i}
            attributes={
              line.bold ? TextAttributes.BOLD : TextAttributes.DIM
            }
          >
            {line.text || " "}
          </text>
        ))}
      </box>
      <SelectMenu
        options={options}
        onSelect={(value) => {
          if (value === "retry") onRetry();
          else onBack();
        }}
      />
    </ScreenLayout>
  );
}
