import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as io from "@actions/io";
import * as os from "os";
import * as path from "path";

const fetch = require("node-fetch");

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
                'Unsupported operating system - Pulumi CLI is only released for Darwin, Linux and Windows',
            );
        }

        const platform = platforms[runnerPlatform];

        let version = core.getInput("pulumi-version");
        if (version == "latest") {
            const resp = await fetch("https://www.pulumi.com/latest-version");
            version = await resp.text();
        }

        const downloadUrl = `https://get.pulumi.com/releases/sdk/pulumi-v${version}-${platform}-x64.${platform == "windows" ? "zip" : "tar.gz"}`;

        const destination = path.join(os.homedir(), '.pulumi');
        core.info(`Install destination is ${destination}`)

        await io
            .rmRF(destination)
            .catch()
            .then(() => {
                core.info(`Successfully deleted pre-existing ${destination}`);
            })

        const downloaded = await tc.downloadTool(downloadUrl);
        core.info(`successfully downloaded ${downloadUrl}`)

        switch (platform) {
            case "windows": {
                await tc.extractZip(downloaded, os.homedir());
                await io.mv(path.join(os.homedir(), 'Pulumi'), path.join(os.homedir(), '.pulumi'));
                break;
            }
            default: {
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
        }

        const cachedPath = await tc.cacheDir(path.join(destination, 'bin'), 'pulumi', version);
        core.addPath(cachedPath);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
