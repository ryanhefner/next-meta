# Releasing next-meta

This checklist keeps the GitHub source, CI result, git tag, and npm package on
the same verified commit.

## One-time npm setup

The publish workflow uses npm trusted publishing, so it does not require a
long-lived `NPM_TOKEN` GitHub secret. Before the first automated release,
configure the `next-meta` package's trusted publisher on npm:

- Provider: GitHub Actions
- Organization or user: `ryanhefner`
- Repository: `next-meta`
- Workflow filename: `publish.yml`
- Allowed action: `npm publish`

The workflow requests GitHub's OIDC token, and npm automatically records
provenance for the published package.

## Prepare

1. Confirm the intended version in `package.json` and `CHANGELOG.md`.
2. Confirm the release branch is clean:

   ```sh
   git status --short --branch
   ```

3. Run the complete local verification:

   ```sh
   yarn install --frozen-lockfile
   yarn verify
   yarn build
   npm publish --dry-run
   ```

4. Confirm the built ESM and CJS entry points load:

   ```sh
   node --input-type=module -e "import('next-meta').then(console.log)"
   node -e "console.log(require('next-meta'))"
   ```

## Merge and verify CI

1. Merge the release branch into `main` using the repository's normal review
   process.
2. Push `main`:

   ```sh
   git push origin main
   ```

3. Wait for the CircleCI workflow on the exact release commit to pass. Do not
   tag or publish a different commit.

## Tag and publish

1. Confirm the currently published npm version:

   ```sh
   npm view next-meta version
   ```

2. Create a GitHub release whose tag is exactly `v` followed by the version in
   `package.json`, such as `v0.4.0`. Use the corresponding `CHANGELOG.md` entry
   as the release notes.
3. Publish the GitHub release. The `Publish Package` workflow will verify that
   the release tag matches `package.json`, run the package's publish lifecycle,
   and publish it to npm.

Stable versions are published with npm's `latest` tag. SemVer prerelease
versions are published with the `next` tag.

## Verify the release

1. Confirm that the `Publish Package` GitHub Actions workflow passed for the
   release.
2. Confirm npm's dist-tags:

   ```sh
   npm view next-meta version dist-tags
   ```

3. Install the published version in a clean consumer project and smoke-test one
   ESM or CJS import.
