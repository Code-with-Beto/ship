import { TextAttributes } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";
import { openBrowser } from "../utils";
import { URLS } from "../types";

export function UpsellScreen() {
  const renderer = useRenderer();

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
  ];

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
          if (value === "platano") {
            openBrowser(URLS.platano);
          } else {
            openBrowser(URLS.pricing);
          }
          renderer.destroy();
        }}
      />
    </ScreenLayout>
  );
}
