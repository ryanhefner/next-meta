# Releasing next-meta

This checklist keeps the GitHub source, CI result, git tag, and npm package on
the same verified commit.

The repository uses the Node.js version declared by `.nvmrc` and `.node-version`
and enforced by `devEngines`, along with the npm version declared by
`packageManager` in `package.json`. Its project-level npm configuration only
resolves package versions that have been published for at least 14 days.

When the age gate blocks a known security fix, add a temporary package-specific
`min-release-age-exclude` entry to `.npmrc`, pin the reviewed fixed version with
an npm override, and document the advisory and removal date. Remove both the
exception and override once the fixed version reaches 14 days.

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

## Dry-run the publish workflow

The `Publish Package` workflow can be run manually from GitHub's Actions tab or
with the GitHub CLI:

```sh
gh workflow run publish.yml --ref main
```

Manual runs always execute `npm publish --dry-run`; they cannot publish the
package. This exercises the hosted runner, lockfile-based dependency
installation,
publish lifecycle, and package assembly. npm trusted-publisher authentication
can only be confirmed by an actual publish.

## Prepare

1. Confirm the intended version in `package.json` and `CHANGELOG.md`.
2. Confirm the release branch is clean:

   ```sh
   git status --short --branch
   ```

3. Run the same script-free installation used by CI, followed by the complete
   local verification:

   ```sh
   npm ci --ignore-scripts
   npm run verify
   npm run test:security
   npm run build
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
