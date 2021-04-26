import * as playback from "jest-playback";
import { getSatisfyingVersion, getVersion } from "../get-version";
playback.setup(__dirname);

describe("get-version", () => {
  process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN || "my-token";
  describe("latest", () => {
    it("should get latest version", async () => {
      const version = await getVersion("latest");
      expect(version).toMatchInlineSnapshot(`"v3.1.0"`);
    });
  });
  describe("range versions", () => {
    it("should match ^3 versions", async () => {
      const version = await getSatisfyingVersion("^3");
      expect(version).toMatchInlineSnapshot(`"v3.1.0"`);
    });
    it("should match 3.*.* versions", async () => {
      const version = await getSatisfyingVersion("3.*.*");
      expect(version).toMatchInlineSnapshot(`"v3.1.0"`);
    });
    it("should match 3.0.* versions", async () => {
      const version = await getSatisfyingVersion("3.0.*");
      expect(version).toMatchInlineSnapshot(`"v3.0.0"`);
    });
    it("should match v1.*.* versions", async () => {
      const version = await getSatisfyingVersion("v1.*.*");
      expect(version).toMatchInlineSnapshot(`"v1.14.1"`);
    });
    it("should match v2.22.* versions", async () => {
      const version = await getSatisfyingVersion("v2.22.*");
      expect(version).toMatchInlineSnapshot(`"v2.22.0"`);
    });
    it("should match 2.17.1 version", async () => {
      const version = await getSatisfyingVersion("2.17.1");
      expect(version).toMatchInlineSnapshot(`"v2.17.1"`);
    });
    it("should match v2.17.2 version", async () => {
      const version = await getSatisfyingVersion("v2.17.2");
      expect(version).toMatchInlineSnapshot(`"v2.17.2"`);
    });
    it("should match v2.5.0 version", async () => {
      const version = await getSatisfyingVersion("2.5.0");
      expect(version).toMatchInlineSnapshot(`"v2.5.0"`);
    });
  });
});
