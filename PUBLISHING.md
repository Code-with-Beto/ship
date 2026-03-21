# Publishing

Published to npm as [`@codewithbeto/ship`](https://www.npmjs.com/package/@codewithbeto/ship).

## Steps

1. Bump the `version` in `package.json`
2. Commit and push to `main`
3. Publish using one of the methods below

## Via GitHub Release (preferred)

1. Go to **Releases** → **Draft a new release**
2. Create a new tag (e.g. `v0.1.0`) matching the version in `package.json`
3. Click **Publish release** — the workflow runs automatically
4. Mark as **pre-release** to publish under the `beta` dist-tag instead of `latest`

## Via Actions Tab (manual)

1. Go to **Actions** → **Publish Package** → **Run workflow**
2. Pick the branch and optionally set a dist-tag (defaults to `latest`)
3. Click **Run workflow**

## Secrets

The workflow needs an `NPM_TOKEN` secret with publish access. This is currently set as an org-level secret in `cwb-org`.

Generate new tokens at https://www.npmjs.com/settings/codewithbeto/tokens (type: **Automation**).
