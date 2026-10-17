// Minimal stand-in for Google OAuth + Drive, for end-to-end tests of the Drive integration.
// Run: node tests/google-mock.cjs 3200, then start the app with
//   GOOGLE_CLIENT_ID=test GOOGLE_CLIENT_SECRET=test GOOGLE_AUTH_URL=http://localhost:3200/auth
//   GOOGLE_TOKEN_URL=http://localhost:3200/token GOOGLE_API_URL=http://localhost:3200
const http = require("http");
const files = []; // { id, name, mimeType, parents, size }
let seq = 0;

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "content-type": "application/json", ...headers });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const authed = req.headers.authorization === "Bearer access-1";
      if (url.pathname === "/auth") {
        const back = new URL(url.searchParams.get("redirect_uri"));
        back.searchParams.set("code", "code-1");
        back.searchParams.set("state", url.searchParams.get("state"));
        return send(res, 302, "", { location: back.toString() });
      }
      if (url.pathname === "/token") {
        const p = new URLSearchParams(body.toString());
        if (p.get("client_id") !== "test") return send(res, 401, { error: "bad client" });
        if (p.get("grant_type") === "authorization_code" && p.get("code") === "code-1") return send(res, 200, { access_token: "access-1", refresh_token: "refresh-1" });
        if (p.get("grant_type") === "refresh_token" && p.get("refresh_token") === "refresh-1") return send(res, 200, { access_token: "access-1" });
        return send(res, 400, { error: "invalid_grant" });
      }
      if (!authed) return send(res, 401, { error: "unauthorized" });
      if (url.pathname === "/oauth2/v2/userinfo") return send(res, 200, { email: "agent@example.com" });
      if (url.pathname === "/_files") return send(res, 200, files);
      if (url.pathname === "/drive/v3/files" && req.method === "GET") {
        const q = url.searchParams.get("q");
        const name = /name = '((?:[^'\\]|\\.)*)'/.exec(q)[1].replace(/\\'/g, "'");
        const parent = /'([^']+)' in parents/.exec(q)?.[1];
        return send(res, 200, { files: files.filter((f) => f.name === name && f.mimeType.endsWith("folder") && (!parent || f.parents.includes(parent))) });
      }
      if (url.pathname === "/drive/v3/files" && req.method === "POST") {
        const meta = JSON.parse(body.toString());
        const f = { id: `f${++seq}`, name: meta.name, mimeType: meta.mimeType, parents: meta.parents ?? ["root"] };
        files.push(f);
        return send(res, 200, { id: f.id });
      }
      if (url.pathname.startsWith("/drive/v3/files/")) {
        const f = files.find((x) => x.id === url.pathname.split("/").pop());
        return f ? send(res, 200, { trashed: false }) : send(res, 404, { error: "not found" });
      }
      if (url.pathname === "/upload/drive/v3/files") {
        const text = body.toString("latin1");
        const meta = JSON.parse(Buffer.from(/\r\n\r\n(\{.*?\})\r\n/s.exec(text)[1], "latin1").toString("utf8"));
        const isPdf = text.includes("%PDF-");
        const f = { id: `f${++seq}`, name: meta.name, mimeType: meta.mimeType, parents: meta.parents, size: body.length, isPdf };
        files.push(f);
        return send(res, 200, { id: f.id, webViewLink: `https://drive.google.com/file/d/${f.id}/view` });
      }
      send(res, 404, { error: "unknown" });
    });
  })
  .listen(Number(process.argv[2] || 3200), () => console.log("google mock ready"));
