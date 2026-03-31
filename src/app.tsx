import { useState, useEffect } from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import type { Screen, Template, OnboardingResult } from "./types";
import { TEMPLATES, URLS } from "./types";
import { openBrowser } from "./utils";
import { track, trackAndWait } from "./tracking";
import { WelcomeScreen } from "./screens/welcome";
import { AccessCheckScreen } from "./screens/access-check";
import { NoAccessScreen } from "./screens/no-access";
import { TroubleshootScreen } from "./screens/troubleshoot";
import { UpsellScreen } from "./screens/upsell";
import { ProjectSetupScreen } from "./screens/project-setup";
import { CloningScreen } from "./screens/cloning";
import { OnboardingScreen } from "./screens/onboarding";
import { ConfiguringScreen } from "./screens/configuring";
import { DoneScreen } from "./screens/done";
import { ErrorScreen } from "./screens/error";

export function App() {
  const renderer = useRenderer();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    TEMPLATES[0]!,
  );
  const [projectName, setProjectName] = useState("");
  const [onboardingResult, setOnboardingResult] =
    useState<OnboardingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryScreen, setRetryScreen] = useState<Screen>("project-setup");

  useEffect(() => {
    track("cli_started");
  }, []);

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
      trackAndWait("exit_early", { screen }).then(() => renderer.destroy());
      return;
    }
    if (key.name === "escape") {
      const back = BACK_MAP[screen];
      if (back) setScreen(back);
      else
        trackAndWait("exit_early", { screen }).then(() =>
          renderer.destroy(),
        );
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
          onSuccess={() => {
            track("access_check_passed", { template: selectedTemplate.name });
            setScreen("project-setup");
          }}
          onFailure={() => {
            track("access_check_failed", { template: selectedTemplate.name });
            setScreen("no-access");
          }}
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
          onDone={() => {
            track("clone_success", { template: selectedTemplate.name });
            setScreen("onboarding");
          }}
          onError={(msg) => {
            setErrorMessage(msg);
            setRetryScreen("project-setup");
            setScreen("error");
          }}
        />
      );

    case "onboarding":
      return (
        <OnboardingScreen
          projectName={projectName}
          onComplete={(result) => {
            setOnboardingResult(result);
            track("onboarding_complete", {
              template: selectedTemplate.name,
            });
            setScreen("configuring");
          }}
        />
      );

    case "configuring":
      return (
        <ConfiguringScreen
          projectName={projectName}
          onboardingResult={onboardingResult!}
          onDone={() => {
            track("configure_success", {
              template: selectedTemplate.name,
            });
            setScreen("done");
          }}
          onError={(msg) => {
            setErrorMessage(msg);
            setRetryScreen("onboarding");
            setScreen("error");
          }}
        />
      );

    case "done":
      return (
        <DoneScreen
          projectName={projectName}
          onboardingResult={onboardingResult!}
        />
      );

    case "error":
      return (
        <ErrorScreen
          message={errorMessage}
          onRetry={() => setScreen(retryScreen)}
        />
      );

    default:
      return null;
  }
}
