# Maintaining and releasing next-meta

Use Node from `.nvmrc` and the pnpm version in `packageManager`. Consumer
requirements are separate from the pinned repository development environment.

## Release checks

Run `pnpm run release:check` before publishing: it checks the advisory budget,
lint, formatting, types, unit coverage, builds, real Next Head behavior, the
README examples, and a clean packed consumer. The packed consumer verifies
server-only imports without React or Next installed, ESM/CommonJS exports,
root/pages context identity, strict declarations, and static/dynamic App Router
plus Pages Router production HTML.

Set `NEXT_VERSION=15 pnpm run release:smoke` to exercise another Next major.
Failed smoke artifacts are retained in the printed temporary directory for
diagnosis. CI tests Next 14/15/16; publishing runs the complete default check.

The version bump and changelog remain explicit release preparation steps.
Publish uses the package version to select `next` for prereleases and `latest`
for stable releases; a release tag must match that version. A manually dispatched
publish workflow validates and dry-runs only.

## GitHub Actions publishing setup

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
with GitHub OIDC, not a stored npm token. In the `next-meta` package settings on
npm, configure a GitHub Actions trusted publisher with:

- Organization or user: `ryanhefner`.
- Repository: `next-meta`.
- Workflow filename: `publish.yml` (not its full path).
- Environment name: leave blank; the publish job does not use a GitHub environment.
- Allow direct publishing with `npm publish`.

No `NODE_AUTH_TOKEN` or `NPM_TOKEN` secret is required. The workflow grants
`id-token: write` and runs on a GitHub-hosted runner with Node 24; npm trusted
publishing requires npm 11.5.1 or newer. Configuring this relationship requires
an authenticated npm account with write access to the package. A successful
manual dry run validates the artifact, but does not prove npm publishing
authorization.

After merging the prepared release and passing CI, publish a GitHub Release
whose `v{version}` tag matches the version committed in `package.json`.
That release event publishes the package with the appropriate dist-tag; manually
dispatching the workflow does not publish. Deploy the docs separately using
the [Vercel setup](DEPLOYMENT.md#production-build).

Strict NodeNext declaration checks allow only existing Next.js-internal missing
Satori/emoji/Sharp/URLPattern declarations, by exact file and diagnostic.
No consumer or next-meta declaration errors are suppressed. The dependency-free
shared-core fixture also has a cold compilation budget of 200,000 type
instantiations, checked independently of Next.js and React types.
