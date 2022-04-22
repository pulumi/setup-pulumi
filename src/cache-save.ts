import fs from "fs";

import * as core from "@actions/core";
import * as cache from "@actions/cache";

import { State } from "./constants";
import * as utils from "./cache-utils";

// Catch and log any unhandled exceptions.  These exceptions can leak out of the uploadChunk method in
// @actions/toolkit when a failed upload closes the file descriptor causing any in-process reads to
// throw an uncaught exception.  Instead of failing this action, just warn.
process.on("uncaughtException", (e) => {
  const warningPrefix = "[warning]";
  core.info(`${warningPrefix}${e.message}`);
});

export async function run() {
  try {
    await cacheBinary();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(`unknown error: ${error}`);
    }
  }
}

export const cacheBinary = async () => {
  if (!utils.isCacheFeatureAvailable()) {
    return;
  }

  const state = core.getState(State.CacheMatchedKey);
  const primaryKey = core.getState(State.CachePrimaryKey);
  const path = core.getState(State.BinaryPath);
  if (!fs.existsSync(path)) {
    throw new Error(`Cache folder path doesn't exist on disk: ${path}`);
  }

  core.debug(
    `checking if cache hit occurred. primaryKey: ${primaryKey}, state: ${state}`
  );
  if (primaryKey === state) {
    core.info(
      `Cache hit occurred on the primary key ${primaryKey}, not saving cache.`
    );
    return;
  }

  try {
    await cache.saveCache([path], primaryKey);
    core.info(`Cache saved with the key: ${primaryKey}`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === cache.ValidationError.name) {
        throw error;
      } else if (error.name === cache.ReserveCacheError.name) {
        core.info(error.message);
      } else {
        core.warning(`${error.message}`);
      }
    } else {
      core.error(`unknown error encountered: ${error}`);
      throw error;
    }
  }
};

run();
