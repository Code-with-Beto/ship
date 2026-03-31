import type { OnboardingResult } from "./types";

export async function configureProject(
  projectName: string,
  config: OnboardingResult,
): Promise<{ ok: boolean; error?: string }> {
  try {
    // 1. Modify src/config/app.ts
    const appConfigPath = `${projectName}/src/config/app.ts`;
    let appConfig = await Bun.file(appConfigPath).text();

    appConfig = appConfig.replace(
      `const APP_NAME = "Platano"`,
      `const APP_NAME = "${config.appName}"`,
    );
    appConfig = appConfig.replace(
      `bundleId: "com.mycompany.platano"`,
      `bundleId: "${config.bundleId}"`,
    );

    if (!config.payments) {
      appConfig = appConfig.replace(`payments: true`, `payments: false`);
    }

    if (config.payments && config.rcTestKeyIos) {
      // Replace iOS key inside revenueCatApiKeyTestStore
      appConfig = appConfig.replace(
        /ios: "test_[^"]*"/,
        `ios: "${config.rcTestKeyIos}"`,
      );
    }

    if (config.payments && config.rcTestKeyAndroid) {
      // Replace Android key inside revenueCatApiKeyTestStore
      appConfig = appConfig.replace(
        /android: "test_[^"]*"/,
        `android: "${config.rcTestKeyAndroid}"`,
      );
    }

    await Bun.write(appConfigPath, appConfig);

    // 2. Modify app.config.ts
    const expoConfigPath = `${projectName}/app.config.ts`;
    let expoConfig = await Bun.file(expoConfigPath).text();

    expoConfig = expoConfig.replace(
      `name: "Platano"`,
      `name: "${config.appName}"`,
    );
    expoConfig = expoConfig.replace(
      `slug: "platano"`,
      `slug: "${config.slug}"`,
    );
    expoConfig = expoConfig.replace(
      `scheme: "platano"`,
      `scheme: "${config.slug}"`,
    );
    expoConfig = expoConfig.replace(
      `bundleIdentifier: "com.mycompany.platano"`,
      `bundleIdentifier: "${config.bundleId}"`,
    );
    expoConfig = expoConfig.replace(
      `package: "com.mycompany.platano"`,
      `package: "${config.bundleId}"`,
    );

    await Bun.write(expoConfigPath, expoConfig);

    // 3. Modify package.json (name → slug)
    const pkgPath = `${projectName}/package.json`;
    const pkgRaw = await Bun.file(pkgPath).text();
    const pkg = JSON.parse(pkgRaw);
    pkg.name = config.slug;
    await Bun.write(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

    // 4. Install dependencies
    const install = await Bun.$`cd ${projectName} && bun install`
      .nothrow()
      .quiet();
    if (install.exitCode !== 0) {
      return { ok: false, error: "Failed to install dependencies" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
