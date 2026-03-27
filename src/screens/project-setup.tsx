import { useState, useCallback } from "react";
import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { ScreenLayout } from "../components/screen-layout";
import type { Template } from "../types";

export function ProjectSetupScreen({
  template,
  onClone,
  onBack,
}: {
  template: Template;
  onClone: (name: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("my-app");
  const [error, setError] = useState("");

  useKeyboard((key) => {
    if (key.name === "escape") {
      onBack();
    }
  });

  const validate = useCallback((value: string): string | null => {
    if (!value.trim()) return "Project name cannot be empty";
    if (/\s/.test(value)) return "Project name cannot contain spaces";
    if (!/^[a-zA-Z0-9._-]+$/.test(value))
      return "Only letters, numbers, dashes, dots, and underscores";
    return null;
  }, []);

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text attributes={TextAttributes.BOLD} fg="green">
          ✓ Access confirmed!
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text>
          Setting up {template.name}. What should we call your project?
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <box border={true} borderStyle="rounded" borderColor="yellow" width={40}>
          <input
            value={name}
            focused={true}
            onInput={(value) => {
              setName(value);
              setError("");
            }}
            onSubmit={(value) => {
              const v = String(value);
              const validationError = validate(v);
              if (validationError) {
                setError(validationError);
                return;
              }
              onClone(v);
            }}
          />
        </box>
      </box>
      {error ? (
        <box justifyContent="center" marginTop={1}>
          <text fg="red">{error}</text>
        </box>
      ) : (
        <box justifyContent="center" marginTop={1}>
          <text attributes={TextAttributes.DIM}>Press Enter to continue</text>
        </box>
      )}
    </ScreenLayout>
  );
}
