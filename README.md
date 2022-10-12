# Setup GitHub Action

This repository contains an action for use with GitHub Actions, which installs a specified version of  the `pulumi` CLI.

`pulumi` is installed into `/home/runner/.pulumi` (or equivalent on Windows) and the `bin` subdirectory is added to the PATH.

## Usage

Install the latest version of the Pulumi CLI:

```yaml
- name: Install Pulumi CLI
  uses: pulumi/setup-pulumi@v3
```

Install a specific version of the Pulumi CLI:

```yaml
- name: Install pulumi
  uses: pulumi/setup-pulumi@v3
  with:
    pulumi-version: 3.3.0
```

Install a version that adheres to a semver range

```yaml
- name: Install pulumi
  uses: pulumi/setup-pulumi@v3
  with:
    pulumi-version: ^3.0.0
```

## Configuration

The action can be configured with the following arguments:

- `pulumi-version` (optional) - The version of the Pulumi CLI to install. Default is `latest`. Accepts semver style values.
