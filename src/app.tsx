import { useState } from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import type { Screen, Template } from "./types";
import { TEMPLATES, URLS } from "./types";
import { openBrowser } from "./utils";
import { WelcomeScreen } from "./screens/welcome";
import { AccessCheckScreen } from "./screens/access-check";
import { NoAccessScreen } from "./screens/no-access";
import { TroubleshootScreen } from "./screens/troubleshoot";
import { UpsellScreen } from "./screens/upsell";
import { ProjectSetupScreen } from "./screens/project-setup";
import { CloningScreen } from "./screens/cloning";
import { DoneScreen } from "./screens/done";
import { ErrorScreen } from "./screens/error";

export function App() {
  const renderer = useRenderer();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    TEMPLATES[0]!
  );
  const [projectName, setProjectName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const BACK_MAP: Partial<Record<Screen, Screen>> = {
    "access-check": "welcome",
    "no-access": "welcome",
    troubleshoot: "no-access",
    upsell: "no-access",
    "project-setup": "welcome",
    error: "welcome",
  };

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") {
      renderer.destroy();
      return;
    }
    if (key.name === "escape") {
      const back = BACK_MAP[screen];
      if (back) setScreen(back);
      else renderer.destroy();
    }
  });

  switch (screen) {
    case "welcome":
      return (
        <WelcomeScreen
          onSelect={(template) => {
            setSelectedTemplate(template);
            setScreen("access-check");
          }}
        />
      );

    case "access-check":
      return (
        <AccessCheckScreen
          template={selectedTemplate}
          onSuccess={() => setScreen("project-setup")}
          onFailure={() => setScreen("no-access")}
        />
      );

    case "no-access":
      return (
        <NoAccessScreen
          onMember={() => setScreen("troubleshoot")}
          onNotMember={() => setScreen("upsell")}
          onBack={() => setScreen("welcome")}
        />
      );

    case "troubleshoot":
      return (
        <TroubleshootScreen
          onRetry={() => setScreen("access-check")}
          onGoToPage={() => openBrowser(URLS.platano)}
          onBack={() => setScreen("no-access")}
        />
      );

    case "upsell":
      return <UpsellScreen onBack={() => setScreen("no-access")} />;

    case "project-setup":
      return (
        <ProjectSetupScreen
          template={selectedTemplate}
          onClone={(name) => {
            setProjectName(name);
            setScreen("cloning");
          }}
          onBack={() => setScreen("welcome")}
        />
      );

    case "cloning":
      return (
        <CloningScreen
          template={selectedTemplate}
          projectName={projectName}
          onDone={() => setScreen("done")}
          onError={(msg) => {
            setErrorMessage(msg);
            setScreen("error");
          }}
        />
      );

    case "done":
      return <DoneScreen projectName={projectName} />;

    case "error":
      return (
        <ErrorScreen
          message={errorMessage}
          onRetry={() => setScreen("project-setup")}
        />
      );

    default:
      return null;
  }
}
