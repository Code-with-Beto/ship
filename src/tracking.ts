import { createHash } from "node:crypto";
import { hostname, userInfo, platform } from "node:os";
import pkg from "../package.json";

const UMAMI_HOST = "https://api.stage.codewithbeto.dev";
const UMAMI_WEBSITE_ID = "d960270e-b454-40f3-90fd-0abe692cecd4";
const UMAMI_ENDPOINT = `${UMAMI_HOST}/api/send`;
const CLI_VERSION = pkg.version;
const OS = platform();

function getVisitorId(): string {
  const raw = `${hostname()}:${userInfo().username}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

interface TrackingMeta {
  screen?: string;
  template?: string;
  reason?: string;
}

async function sendEvent(
  eventName: string,
  meta?: TrackingMeta,
): Promise<void> {
  await fetch(UMAMI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `ship-cli/${CLI_VERSION} (${OS}) ${getVisitorId()}`,
    },
    body: JSON.stringify({
      type: "event",
      payload: {
        website: UMAMI_WEBSITE_ID,
        url: `/cli/${meta?.screen ?? eventName}`,
        event_name: eventName,
        hostname: "cli.codewithbeto.dev",
        data: {
          os: OS,
          version: CLI_VERSION,
          ...(meta?.template && { template: meta.template }),
          ...(meta?.reason && { reason: meta.reason }),
        },
      },
    }),
  });
}

export function track(eventName: string, meta?: TrackingMeta): void {
  sendEvent(eventName, meta).catch(() => {});
}

export async function trackAndWait(
  eventName: string,
  meta?: TrackingMeta,
): Promise<void> {
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 500));
  const send = sendEvent(eventName, meta).catch(() => {});
  await Promise.race([send, timeout]);
}
