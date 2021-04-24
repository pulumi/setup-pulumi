import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as io from "@actions/io";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getVersion } from "./lib/get-version";

const makeDir = require('make-dir');

async function run() {
    try {
        const platforms = {
            linux: 'linux',
            darwin: 'darwin',
            win32: 'windows',
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
        const version = await getVersion(range);

        core.info(`Matched version: ${version}`);

        const downloadUrl = `https://get.pulumi.com/releases/sdk/pulumi-${version}-${platform}-x64.${platform == "windows" ? "zip" : "tar.gz"}`;
        const destination = path.join(os.homedir(), ".pulumi");
        core.info(`Install destination is ${destination}`)
        if (fs.existsSync(destination)) {
            await io.rmRF(destination)
            core.info(`Successfully deleted pre-existing ${destination}`)
        }

        const downloaded = await tc.downloadTool(downloadUrl);
        core.info(`successfully downloaded ${downloadUrl}`)


        // The packages for Windows and *nix are structured differently - note the extraction paths for each.
        switch (platform) {
            case "windows":
                await tc.extractZip(downloaded, os.homedir());
                fs.renameSync(path.join(os.homedir(), "Pulumi"), destination);
                break;
            default:
                let destinationPath = await makeDir(destination);
                core.info(`Successfully created ${destinationPath}`)
                let extractedPath = await tc.extractTar(downloaded, destination);
                core.info(`Successfully extracted ${downloaded} to ${extractedPath}`)
                let oldPath = path.join(destination, "pulumi")
                let newPath = path.join(destination, "bin")
                fs.renameSync(oldPath, newPath);
                core.info(`Successfully renamed ${oldPath} to ${newPath}`)
                break;
        }

        core.addPath(path.join(destination, "bin"));

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
