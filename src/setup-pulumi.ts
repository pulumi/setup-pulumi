import * as os from "os";
import * as path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as io from '@actions/io';
import { getVersionObject } from "./lib/get-version";
import { restoreCache } from "./cache-restore";

const pkgName = "pulumi"

async function run() {
    try {
        const platforms = {
            linux: 'linux-x64',
            darwin: 'darwin-x64',
            win32: 'windows-x64',
        };

        const runnerPlatform = os.platform();

        if (!(runnerPlatform in platforms)) {
          throw new Error(
            "Unsupported operating system - Pulumi CLI is only released for Darwin, Linux and Windows"
          );
        }

        const platform = platforms[runnerPlatform];

        const range = core.getInput("pulumi-version");
        core.info(`Configured range: ${range}`);
        const { version, downloads } = await getVersionObject(range);

        core.info(`Matched version: ${version}`);

        // first see if package is in the toolcache (installed locally)
        const toolcacheDir = tc.find(pkgName, version);
        if (toolcacheDir) {
          core.addPath(toolcacheDir);
          core.info(`using ${pkgName} from toolcache (${toolcacheDir})`);
          return;
        }

        const destination = path.join(os.homedir(), ".pulumi");
        // then try to restore package from the github action cache
        const restored = await restoreCache(pkgName, path.join(destination, 'bin'), version);
        if (restored) {
          core.addPath(path.join(destination, 'bin'));
          return;
        }

        core.info(`Install destination is ${destination}`)

        await io
            .rmRF(path.join(destination, 'bin'))
            .catch()
            .then(() => {
                core.info(`Successfully deleted pre-existing ${path.join(destination, "bin")}`);
            })

        const downloaded = await tc.downloadTool(downloads[platform]);
        core.debug(`successfully downloaded ${downloads[platform]}`);


        // The packages for Windows and *nix are structured differently - note the extraction paths for each.
        switch (platform) {
            case "windows":
                await tc.extractZip(downloaded, os.homedir());
                await io.mv(path.join(os.homedir(), 'Pulumi'), path.join(os.homedir(), '.pulumi'));
                break;
            default:
                const destinationPath = await io.mkdirP(destination);
                core.info(`Successfully created ${destinationPath}`)
                const extractedPath = await tc.extractTar(downloaded, destination);
                core.info(`Successfully extracted ${downloaded} to ${extractedPath}`)
                const oldPath = path.join(destination, 'pulumi')
                const newPath = path.join(destination, 'bin')
                await io.mv(oldPath, newPath);
                core.info(`Successfully renamed ${oldPath} to ${newPath}`)
                break;
        }

        const cachedPath = await tc.cacheDir(path.join(destination, 'bin'), pkgName, version);
        core.addPath(cachedPath);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
