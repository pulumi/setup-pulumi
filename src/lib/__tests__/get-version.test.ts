import { getSatisfyingVersion } from "../get-version";
import nock from "nock";

const nockBack = nock.back;
nockBack.fixtures = `${__dirname}/../__fixtures__`;
nockBack.setMode("record");

describe("get-version", () => {
  let nockDone: () => void;
  beforeEach(async () => {
    process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN || "my-token";
    const nb = await nockBack("get-version.json");
    nockDone = nb.nockDone;
  });
  afterEach(async () => {
    await nockDone();
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
