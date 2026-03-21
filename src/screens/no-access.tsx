import { TextAttributes } from "@opentui/core";
import { ScreenLayout } from "../components/screen-layout";
import { SelectMenu } from "../components/select-menu";

export function NoAccessScreen({
  onMember,
  onNotMember,
}: {
  onMember: () => void;
  onNotMember: () => void;
}) {
  const options = [
    {
      name: "Yes, I'm a member",
      description: "I have access but something went wrong",
      value: "member" as const,
    },
    {
      name: "No, tell me more",
      description: "I'd like to get access",
      value: "not-member" as const,
    },
  ];

  return (
    <ScreenLayout>
      <box justifyContent="center" marginTop={2}>
        <text fg="yellow" attributes={TextAttributes.BOLD}>
          You don't have access to this template yet.
        </text>
      </box>
      <box justifyContent="center" marginTop={1}>
        <text>Are you a Code with Beto member?</text>
      </box>
      <SelectMenu
        options={options}
        onSelect={(value) => {
          if (value === "member") onMember();
          else onNotMember();
        }}
      />
    </ScreenLayout>
  );
}
