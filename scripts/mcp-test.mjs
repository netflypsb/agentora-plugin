// Agentora plugin test: drive customer-outreach MCP server via JSON-RPC (node fetch — workers.dev SSL-safe)
const MCP_URL = "https://customer-outreach-mcp.netflypsb.workers.dev/mcp";
const API_KEY = process.env.AGENTORA_API_KEY || "";;

let sessionId = null;
let idCounter = 0;

async function rpc(method, params) {
  const id = ++idCounter;
  const body = { jsonrpc: "2.0", id, method, params: params || {} };
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify(body),
  });
  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;
  const text = await res.text();
  // Handle SSE response format
  if (text.startsWith("event:") || text.includes("data:")) {
    const lines = text.split("\n").filter((l) => l.startsWith("data:"));
    const last = lines.length ? lines[lines.length - 1].slice(5).trim() : text;
    try { return { status: res.status, data: JSON.parse(last) }; }
    catch { return { status: res.status, data: text.slice(0, 500) }; }
  }
  try { return { status: res.status, data: JSON.parse(text) }; }
  catch { return { status: res.status, data: text.slice(0, 500) }; }
}

async function main() {
  const mode = process.argv[2] || "list";

  if (mode === "list") {
    const init = await rpc("initialize", {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "hermes-plugin-test", version: "1.0.0" },
    });
    console.log("INIT status:", init.status);
    console.log("serverInfo:", JSON.stringify(init.data?.result?.serverInfo || init.data).slice(0, 300));
    await rpc("notifications/initialized", {});
    const tools = await rpc("tools/list", {});
    const list = tools.data?.result?.tools || [];
    console.log("TOOLS:", list.length);
    for (const t of list) console.log(`- ${t.name}: ${(t.description || "").slice(0, 90)}`);
    return;
  }

  // tool call mode: argv[2]=tool name, argv[3]=JSON args
  const toolName = mode;
  const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  // Fresh session per call (stateless worker)
  sessionId = null;
  await rpc("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "hermes-plugin-test", version: "1.0.0" },
  });
  await rpc("notifications/initialized", {});
  const out = await rpc("tools/call", { name: toolName, arguments: args });
  console.log("CALL status:", out.status);
  const content = out.data?.result?.content;
  if (content) {
    for (const c of content) {
      if (c.type === "text") console.log(c.text);
      else console.log(`[${c.type}]`, JSON.stringify(c).slice(0, 200));
    }
  } else {
    console.log(JSON.stringify(out.data).slice(0, 1500));
  }
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });