// Read-only release gate: only the isolated Cloudflare Workers staging hostname.
const origin = new URL("https://cf-migrate-forexnext-stage.farukkhanone.workers.dev");
const checks = [{ path: "/", kind: "html" }];
let failures = 0;
for (const { path, kind } of checks) {
  try {
    const response = await fetch(new URL(path, origin), {
      method: "GET", redirect: "manual", signal: AbortSignal.timeout(20000),
      headers: { "user-agent": "Cloudflare-Stage-ReadOnly-Gate/1.0" },
    });
    const body = (await response.text()).slice(0, 100000);
    let contentOk = false;
    if (kind === "html") {
      contentOk = (response.headers.get("content-type") || "").includes("text/html") && body.toLowerCase().includes("<html") && !/preview pending/i.test(body);
    } else {
      try {
        const data = JSON.parse(body);
        contentOk = data.service === null && data.status === "ok";
      } catch { contentOk = false; }
    }
    const pass = response.status === 200 && contentOk;
    console.log(`${pass ? "PASS" : "FAIL"} ${path}: HTTP ${response.status}; content=${kind}; valid=${contentOk}`);
    if (!pass) failures++;
  } catch (e) {
    console.error(`FAIL ${path}: ${e instanceof Error ? e.message : String(e)}`);
    failures++;
  }
}
if (failures) {
  console.error(`Cloudflare staging gate failed (${failures} check(s)); do NOT attach a production domain.`);
  process.exitCode = 1;
}
