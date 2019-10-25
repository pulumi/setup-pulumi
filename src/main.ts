import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const fetch = require("node-fetch");
const mkdirp = require("mkdirp-promise");

async function run() {
    try {
        let platform = "";
        switch (os.platform()) {
            case "linux":
                platform = "linux";
                break;
            case "darwin":
                platform = "darwin";
                break;
            case "win32":
                platform = "windows";
                break;
            default:
                core.setFailed("Unsupported operating system - Pulumi CLI is only released for Darwin, Linux and Windows");
                return;
        }

        let version = core.getInput("pulumi-version");
        if (version == "latest") {
            const resp = await fetch("https://www.pulumi.com/latest-version");
            version = await resp.text();
        }

        const downloadUrl = `https://get.pulumi.com/releases/sdk/pulumi-v${version}-${platform}-x64.${platform == "windows" ? "zip" : "tar.gz"}`;
        const destination = path.join(os.homedir(), ".pulumi");

        const downloaded = await tc.downloadTool(downloadUrl);

        // The packages for Windows and *nix are structured differently - note the extraction paths for each.
        switch (platform) {
            case "windows":
                await tc.extractZip(downloaded, os.homedir());
                fs.renameSync(path.join(os.homedir(), "Pulumi"), path.join(os.homedir(), ".pulumi"));
                break;
            default:
                await mkdirp(destination);
                await tc.extractTar(downloaded, destination);
                fs.renameSync(path.join(destination, "pulumi"), path.join(destination, "bin"));
                break;
        }

        core.addPath(path.join(destination, "bin"));
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
