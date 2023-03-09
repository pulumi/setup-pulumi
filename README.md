# Setup GitHub Action

### Deprecation notice

**Warning** This action has been deprecated.

Please use the [pulumi/actions](https://github.com/pulumi/actions) action
in [installation only mode](https://github.com/pulumi/actions#installation-only).
</td></tr></table>

#### Migrating to pulumi/actons

To migrate, switch to `pulumi/actions@v4`.

<table>
<thead><tr><td>Before</td><td>After</td></tr></thead>
<tbody>
<tr><td>

```yaml
- name: Install pulumi
  uses: pulumi/setup-pulumi@v2
```

---

```yaml
- name: Install pulumi
  uses: pulumi/setup-pulumi@v2
  with:
    pulumi-version: 3.3.0
```

</td><td>

```yaml
- name: Install pulumi
  uses: pulumi/actions@v4
```

---

```yaml
- name: Install pulumi
  uses: pulumi/actions@v4
  with:
    pulumi-version: 3.3.0
```

</td></tr>

</tbody>
</table>

## Introduction

This repository contains an action for use with GitHub Actions, which installs a specified version of  the `pulumi` CLI.

`pulumi` is installed into `/home/runner/.pulumi` (or equivalent on Windows) and the `bin` subdirectory is added to the PATH.

## Usage

Install the latest version of the Pulumi CLI:

```yaml
- name: Install Pulumi CLI
  uses: pulumi/setup-pulumi@v2
```

Install a specific version of the Pulumi CLI:

```yaml
- name: Install pulumi
  uses: pulumi/setup-pulumi@v2
  with:
    pulumi-version: 3.3.0
```

Install a version that adheres to a semver range

```yaml
- name: Install pulumi
  uses: pulumi/setup-pulumi@v2
  with:
    pulumi-version: ^3.0.0
```

## Configuration

The action can be configured with the following arguments:

- `pulumi-version` (optional) - The version of the Pulumi CLI to install. Default is `latest`. Accepts semver style values.
