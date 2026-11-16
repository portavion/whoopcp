import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { requireMcpBearer } from "../src/auth.ts"
import type { Env } from "../src/env.ts"

function env(extra?: string): Env {
  return { MCP_TOKEN: "main", MCP_CLIENT_TOKENS: extra } as Env
}

async function status(token: string | null, e: Env): Promise<number> {
  const headers: Record<string, string> = token ? { Authorization: "Bearer " + token } : {}
  const denied = await requireMcpBearer(new Request("https://whoop.example/mcp", { method: "POST", headers }), e)
  return denied ? denied.status : 200
}

describe("MCP bearer", function () {
  it("accepts MCP_TOKEN and each client token", async function () {
    const e = env(" souffle , grok ")
    assert.equal(await status("main", e), 200)
    assert.equal(await status("souffle", e), 200)
    assert.equal(await status("grok", e), 200)
  })

  it("rejects unknown, missing and empty-entry tokens", async function () {
    const e = env("souffle,,")
    assert.equal(await status("other", e), 401)
    assert.equal(await status(null, e), 401)
    assert.equal(await status("souffle,", e), 401)
    assert.equal(await status("other", env()), 401)
  })
})
