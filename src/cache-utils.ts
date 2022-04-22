import * as core from "@actions/core";
import * as cache from "@actions/cache";

export function isGhes(): boolean {
  const ghUrl = new URL(
    process.env["GITHUB_SERVER_URL"] || "https://github.com"
  );
  return ghUrl.hostname.toUpperCase() !== "GITHUB.COM";
}

export function isCacheFeatureAvailable(): boolean {
  if (!cache.isFeatureAvailable()) {
    if (isGhes()) {
      throw new Error(
        "Cache action is only supported on GHES version >= 3.5. If you are on version >=3.5 Please check with GHES admin if Actions cache service is enabled or not."
      );
    } else {
      core.warning(
        "The runner was not able to contact the cache service. Caching will be skipped"
      );
    }

    return false;
  }

  return true;
}
