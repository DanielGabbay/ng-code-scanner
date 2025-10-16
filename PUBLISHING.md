# Publishing Guide for ng-code-scanner

This guide walks you through the process of publishing the ng-code-scanner library to npm.

## Prerequisites

1. **npm Account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm Login**: Login to npm from your terminal:
   ```bash
   npm login
   ```

## Pre-Publishing Checklist

Before publishing, make sure:

- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated with the new version
- [ ] package.json version is bumped appropriately
- [ ] README.md is complete and accurate
- [ ] All files are committed to git

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version (1.0.0 → 2.0.0): Breaking changes
- **MINOR** version (1.0.0 → 1.1.0): New features (backwards compatible)
- **PATCH** version (1.0.0 → 1.0.1): Bug fixes (backwards compatible)

## Publishing Steps

### 1. Update Version Number

Edit `projects/ng-code-scanner/package.json`:

```json
{
  "name": "ng-code-scanner",
  "version": "1.0.0",  // Update this
  ...
}
```

### 2. Update CHANGELOG

Add a new section to `projects/ng-code-scanner/CHANGELOG.md`:

```markdown
## [1.0.1] - 2025-10-XX

### Fixed
- Fixed issue with...

### Added
- Added feature...
```

### 3. Build the Library

Build the library in production mode:

```bash
ng build ng-code-scanner --configuration production
```

This creates the build output in `dist/ng-code-scanner/`.

### 4. Verify the Build

Check the dist folder:

```bash
cd dist/ng-code-scanner
ls -la
```

You should see:
- README.md
- package.json
- esm2022/
- fesm2022/
- And other build artifacts

### 5. Test the Package Locally (Optional but Recommended)

Before publishing, you can test the package locally:

```bash
cd dist/ng-code-scanner
npm pack
```

This creates a `.tgz` file. Install it in another project to test:

```bash
npm install /path/to/ng-code-scanner-1.0.0.tgz
```

### 6. Publish to npm

From the dist folder:

```bash
cd dist/ng-code-scanner
npm publish
```

For the first publish, you might need to add `--access public` if it's a scoped package:

```bash
npm publish --access public
```

### 7. Verify Publication

Check that your package is live:

```bash
npm view ng-code-scanner
```

Or visit: https://www.npmjs.com/package/ng-code-scanner

### 8. Create a Git Tag

Tag the release in git:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Publishing a Beta Version

To publish a beta/pre-release version:

1. Update version to include a pre-release tag:
   ```json
   "version": "1.1.0-beta.0"
   ```

2. Publish with the beta tag:
   ```bash
   npm publish --tag beta
   ```

Users can install beta versions with:
```bash
npm install ng-code-scanner@beta
```

## Unpublishing (Use with Caution)

If you need to unpublish a version within 72 hours:

```bash
npm unpublish ng-code-scanner@1.0.0
```

**Note**: Unpublishing is discouraged. Consider publishing a patch version instead.

## Automation

Consider setting up GitHub Actions for automated publishing. Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: ng build ng-code-scanner --configuration production
      - run: cd dist/ng-code-scanner && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### "Package already exists"
- The version number must be unique. Bump the version and try again.

### "Permission denied"
- Make sure you're logged in: `npm login`
- Ensure you have publishing rights for the package

### "Invalid package.json"
- Verify all required fields are present in package.json
- Check that the package name is available on npm

## Post-Publication

1. **Announce**: Share the release on social media, forums, etc.
2. **Update GitHub**: Create a release on GitHub with release notes
3. **Documentation**: Update any external documentation or demo sites
4. **Monitor**: Watch for issues and feedback

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Angular Library Guide](https://angular.dev/tools/libraries)
- [Semantic Versioning](https://semver.org/)
