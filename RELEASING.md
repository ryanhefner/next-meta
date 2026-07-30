# Releasing next-meta

This checklist keeps the GitHub source, CI result, git tag, and npm package on
the same verified commit.

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

1. Confirm npm authentication and the currently published version:

   ```sh
   npm whoami
   npm view next-meta version
   ```

2. Create and push the annotated version tag:

   ```sh
   git tag -a v0.4.0 -m "next-meta v0.4.0"
   git push origin v0.4.0
   ```

3. Publish the package:

   ```sh
   npm publish
   ```

## Verify the release

1. Confirm npm's `latest` tag:

   ```sh
   npm view next-meta version dist-tags
   ```

2. Create the GitHub release from the version tag using the corresponding
   `CHANGELOG.md` entry as the release notes.
3. Install the published version in a clean consumer project and smoke-test one
   ESM or CJS import.
