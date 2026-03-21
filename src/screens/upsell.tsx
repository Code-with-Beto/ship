import { useState } from "react";
import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";
import { openBrowser } from "../utils";
import { URLS } from "../types";

export function UpsellScreen({ onBack }: { onBack: () => void }) {
  const [linkOpened, setLinkOpened] = useState(false);

  const options = [
    {
      name: "Get Platano",
      description: "Buy the React Native starter template",
      value: "platano" as const,
    },
    {
      name: "Become a Pro Member",
      description: "Access all templates, courses & community",
      value: "pro" as const,
    },
    {
      name: "← Go back",
      description: "",
      value: "back" as const,
    },
  ];

  const afterOptions = [
    {
      name: "Open link again",
      description: "",
      value: "reopen" as const,
    },
    {
      name: "← Go back",
      description: "",
      value: "back" as const,
    },
  ];

  const [lastUrl, setLastUrl] = useState("");

  if (linkOpened) {
    return (
      <ScreenLayout>
        <box justifyContent="center" marginTop={2}>
          <text fg="green" attributes={TextAttributes.BOLD}>
            ✓ Link opened in your browser!
          </text>
        </box>
        <box justifyContent="center" marginTop={1}>
          <text attributes={TextAttributes.DIM}>
            Complete your purchase there, then come back and run ship again.
          </text>
        </box>
        <SelectMenu
          options={afterOptions}
          onSelect={(value) => {
            if (value === "reopen") openBrowser(lastUrl);
            else onBack();
          }}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text attributes={TextAttributes.BOLD}>Get access</text>
      </box>
      <box
        flexDirection="column"
        marginTop={1}
        marginLeft={4}
        marginRight={4}
      >
        <text>
          Platano is a premium React Native starter used by developers who want
          to ship fast.
        </text>
        <text attributes={TextAttributes.DIM} marginTop={1}>
          You can buy it individually or unlock everything with a Pro membership.
        </text>
      </box>
      <SelectMenu
        options={options}
        onSelect={(value) => {
          if (value === "back") {
            onBack();
            return;
          }
          const url = value === "platano" ? URLS.platano : URLS.pricing;
          openBrowser(url);
          setLastUrl(url);
          setLinkOpened(true);
        }}
      />
    </ScreenLayout>
  );
}
