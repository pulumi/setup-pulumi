import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { OctokitOptions } from "@octokit/core/dist-types/types";
import { maxSatisfying } from "semver";

export async function getSatisfyingVersion(
  range: string
): Promise<string | null> {
  const octokit = getOctokit(
    core.getInput("github-token") || process.env.GITHUB_TOKEN || ""
  );
  
  const releases = await octokit.paginate(octokit.rest.repos.listTags, {
    repo: "pulumi",
    owner: "pulumi",
    per_page: 100,
  });

  const versions: string[] = releases.map((r) => r.name);

  return maxSatisfying(versions, range);
}
