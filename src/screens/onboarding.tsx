import { useState } from "react";
import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { userInfo } from "node:os";
import { ScreenLayout } from "../components/screen-layout";
import { toSlug, toTitleCase, sanitizeUsername } from "../types";
import type { OnboardingResult } from "../types";

export function OnboardingScreen({
  projectName,
  onComplete,
}: {
  projectName: string;
  onComplete: (result: OnboardingResult) => void;
}) {
  const defaultAppName = toTitleCase(projectName);
  const username = sanitizeUsername(userInfo().username);

  const [step, setStep] = useState(0);
  const [appName, setAppName] = useState(defaultAppName);
  const [bundleId, setBundleId] = useState("");
  const [payments, setPayments] = useState(true);
  const [rcTestKeyIos, setRcTestKeyIos] = useState("");
  const [rcTestKeyAndroid, setRcTestKeyAndroid] = useState("");
  const [error, setError] = useState("");

  useKeyboard((key) => {
    if (key.name === "escape" && step > 0) {
      if (step === 3 || step === 4) {
        // Go back within RC key steps or to payments
        setStep(step - 1);
      } else {
        setStep(step - 1);
      }
      setError("");
    }
  });

  function submitAppName(value: string) {
    const v = String(value).trim() || defaultAppName;
    if (!v) {
      setError("App name can't be empty");
      return;
    }
    setAppName(v);
    const slug = toSlug(v);
    setBundleId(`com.${username}.${slug}`);
    setError("");
    setStep(1);
  }

  function submitBundleId(value: string) {
    const v =
      String(value).trim() || `com.${username}.${toSlug(appName)}`;
    if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/.test(v)) {
      setError("Needs reverse-domain format (e.g. com.yourname.coolapp)");
      return;
    }
    setBundleId(v);
    setError("");
    setStep(2);
  }

  function submitPayments(enabled: boolean) {
    setPayments(enabled);
    setError("");
    if (enabled) {
      setStep(3);
    } else {
      finish(appName, bundleId, false, "", "");
    }
  }

  function submitRcKeyIos(value: string) {
    const v = String(value).trim();
    setRcTestKeyIos(v);
    setRcTestKeyAndroid(v);
    setError("");
    setStep(4);
  }

  function submitRcKeyAndroid(value: string) {
    const v = String(value).trim() || rcTestKeyIos;
    setRcTestKeyAndroid(v);
    setError("");
    finish(appName, bundleId, true, rcTestKeyIos, v);
  }

  function finish(
    name: string,
    bundle: string,
    pay: boolean,
    iosKey: string,
    androidKey: string,
  ) {
    onComplete({
      appName: name,
      slug: toSlug(name),
      bundleId: bundle,
      payments: pay,
      rcTestKeyIos: iosKey,
      rcTestKeyAndroid: androidKey,
    });
  }

  return (
    <ScreenLayout>
      <box flexDirection="column" marginTop={1}>
        <box justifyContent="center">
          <text attributes={TextAttributes.DIM}>
            All of these can be changed later in src/config/app.ts.
          </text>
        </box>
        <box justifyContent="center">
          <text attributes={TextAttributes.DIM}>
            Press Enter to skip any question and keep the default.
          </text>
        </box>
      </box>

      {/* Completed steps */}
      <box flexDirection="column" marginTop={1}>
        {step > 0 && (
          <box justifyContent="center">
            <text fg="green">
              {"  "}✓ App name: {appName}
            </text>
          </box>
        )}
        {step > 1 && (
          <box justifyContent="center">
            <text fg="green">
              {"  "}✓ Bundle ID: {bundleId}
            </text>
          </box>
        )}
        {step > 2 && (
          <box justifyContent="center">
            <text fg="green">
              {"  "}✓ Payments: {payments ? "enabled" : "skipped"}
            </text>
          </box>
        )}
        {step > 3 && payments && (
          <box justifyContent="center">
            <text fg="green">
              {"  "}✓ RC key (iOS):{" "}
              {rcTestKeyIos ? rcTestKeyIos.slice(0, 20) + "..." : "skipped"}
            </text>
          </box>
        )}
      </box>

      {/* Step 0: App name */}
      {step === 0 && (
        <box flexDirection="column" marginTop={1}>
          <box justifyContent="center">
            <text attributes={TextAttributes.BOLD}>
              What's your app called?
            </text>
          </box>
          <box justifyContent="center">
            <text attributes={TextAttributes.DIM}>
              This shows up on the home screen and app stores.
            </text>
          </box>
          <box justifyContent="center" marginTop={1}>
            <box
              border={true}
              borderStyle="rounded"
              borderColor="yellow"
              width={40}
            >
              <input
                value={appName}
                focused={true}
                onInput={(v) => {
                  setAppName(String(v));
                  setError("");
                }}
                onSubmit={(v) => submitAppName(String(v))}
              />
            </box>
          </box>
        </box>
      )}

      {/* Step 1: Bundle ID */}
      {step === 1 && (
        <box flexDirection="column" marginTop={1}>
          <box justifyContent="center">
            <text attributes={TextAttributes.BOLD}>Bundle identifier?</text>
          </box>
          <box justifyContent="center">
            <text attributes={TextAttributes.DIM}>
              A unique ID for the app stores — like a reverse domain
            </text>
          </box>
          <box justifyContent="center">
            <text attributes={TextAttributes.DIM}>
              (e.g. com.yourname.coolapp). Used for both iOS and Android.
            </text>
          </box>
          <box justifyContent="center" marginTop={1}>
            <box
              border={true}
              borderStyle="rounded"
              borderColor="yellow"
              width={50}
            >
              <input
                value={bundleId}
                focused={true}
                onInput={(v) => {
                  setBundleId(String(v));
                  setError("");
                }}
                onSubmit={(v) => submitBundleId(String(v))}
              />
            </box>
          </box>
        </box>
      )}

      {/* Step 2: Payments */}
      {step === 2 && (
        <box flexDirection="column" marginTop={1}>
          <box justifyContent="center">
            <text attributes={TextAttributes.BOLD}>
              Enable payments with RevenueCat?
            </text>
          </box>
          <box justifyContent="center" marginTop={1}>
            <select
              options={[
                {
                  name: "Yes, set it up",
                  description: "Configure RevenueCat test store keys",
                },
                {
                  name: "Skip for now — I'll add it later",
                  description: "You can enable this anytime",
                },
              ]}
              selectedIndex={0}
              focused={true}
              wrapSelection={true}
              height={5}
              onSelect={(index) => submitPayments(index === 0)}
            />
          </box>
        </box>
      )}

      {/* Step 3: RC key iOS */}
      {step === 3 && (
        <box flexDirection="column" marginTop={1}>
          <box justifyContent="center">
            <text attributes={TextAttributes.BOLD}>
              RevenueCat test store API key (iOS):
            </text>
          </box>
          <box justifyContent="center">
            <text attributes={TextAttributes.DIM}>
              Paste your key or press Enter to skip for now.
            </text>
          </box>
          <box justifyContent="center" marginTop={1}>
            <box
              border={true}
              borderStyle="rounded"
              borderColor="yellow"
              width={50}
            >
              <input
                value={rcTestKeyIos}
                focused={true}
                onInput={(v) => {
                  setRcTestKeyIos(String(v));
                  setError("");
                }}
                onSubmit={(v) => submitRcKeyIos(String(v))}
              />
            </box>
          </box>
        </box>
      )}

      {/* Step 4: RC key Android */}
      {step === 4 && (
        <box flexDirection="column" marginTop={1}>
          <box justifyContent="center">
            <text attributes={TextAttributes.BOLD}>
              RevenueCat test store API key (Android):
            </text>
          </box>
          <box justifyContent="center">
            <text attributes={TextAttributes.DIM}>
              {rcTestKeyIos
                ? "Press Enter to use the same key as iOS."
                : "Paste your key or press Enter to skip."}
            </text>
          </box>
          <box justifyContent="center" marginTop={1}>
            <box
              border={true}
              borderStyle="rounded"
              borderColor="yellow"
              width={50}
            >
              <input
                value={rcTestKeyAndroid}
                focused={true}
                onInput={(v) => {
                  setRcTestKeyAndroid(String(v));
                  setError("");
                }}
                onSubmit={(v) => submitRcKeyAndroid(String(v))}
              />
            </box>
          </box>
        </box>
      )}

      {/* Error message */}
      {error ? (
        <box justifyContent="center" marginTop={1}>
          <text fg="red">{error}</text>
        </box>
      ) : null}

      {/* Post-confirm notes */}
      {step === 2 && (
        <box justifyContent="center" marginTop={1}>
          <text attributes={TextAttributes.DIM}>
            You can toggle this anytime in src/config/app.ts
          </text>
        </box>
      )}

      {/* Discord help */}
      <box justifyContent="center" marginTop={1}>
        <text attributes={TextAttributes.DIM}>
          Need help? Join us at https://cwb.sh/discord
        </text>
      </box>
    </ScreenLayout>
  );
}
