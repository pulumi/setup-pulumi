"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fetch = require("node-fetch");
const mkdirp = require("mkdirp-promise");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
                const resp = yield fetch("https://www.pulumi.com/latest-version");
                version = yield resp.text();
            }
            const downloadUrl = `https://get.pulumi.com/releases/sdk/pulumi-v${version}-${platform}-x64.${platform == "windows" ? "zip" : "tar.gz"}`;
            const destination = path.join(os.homedir(), ".pulumi");
            const downloaded = yield tc.downloadTool(downloadUrl);
            // The packages for Windows and *nix are structured differently - note the extraction paths for each.
            switch (platform) {
                case "windows":
                    yield tc.extractZip(downloaded, os.homedir());
                    fs.renameSync(path.join(os.homedir(), "Pulumi"), path.join(os.homedir(), ".pulumi"));
                    break;
                default:
                    yield mkdirp(destination);
                    yield tc.extractTar(downloaded, destination);
                    fs.renameSync(path.join(destination, "pulumi"), path.join(destination, "bin"));
                    break;
            }
            core.addPath(path.join(destination, "bin"));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
