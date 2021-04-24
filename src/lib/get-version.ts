import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { maxSatisfying } from "semver";

export async function getSatisfyingVersion(
  range: string
): Promise<string | null> {
  const octokit = getOctokit(
    core.getInput("github-token") || process.env.GITHUB_TOKEN || ''
  );
  const releases = await octokit.repos.listReleases({
    repo: "pulumi",
    owner: "pulumi",
  });

  const versions = releases.data.map((r) => r.tag_name);

  return maxSatisfying(versions, range);
}
