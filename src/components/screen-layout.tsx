import type { ReactNode } from "react";
import { Header } from "./header";

export function ScreenLayout({ children }: { children: ReactNode }) {
  return (
    <box flexDirection="column" flexGrow={1}>
      <Header />
      {children}
    </box>
  );
}
