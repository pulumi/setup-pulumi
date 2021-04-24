import { getSatisfyingVersion } from "../get-version";
import nock from "nock";

const nockBack = nock.back;
nockBack.fixtures = `${__dirname}/../__fixtures__`;

describe("get-version", () => {
  beforeEach(async () => {
    process.env.GITHUB_TOKEN = "my-token";
    await nockBack("get-version.json");
  });
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
});
