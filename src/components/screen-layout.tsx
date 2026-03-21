import type { ReactNode } from "react";
import { Header } from "./header";

export function ScreenLayout({ children }: { children: ReactNode }) {
  return (
    <box flexDirection="column" flexGrow={1} padding={2}>
      <Header />
      {children}
    </box>
  );
}
