import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { Env } from "../src/env.ts"
import { ownerStatus } from "../src/whoop/tokens.ts"

function env(expiresAt: number | null): Env {
  const raw = expiresAt === null ? null : JSON.stringify({ access_token: "a", refresh_token: "r", expires_at: expiresAt })
  return { WHOOP_TOKENS: { get: async () => raw } as unknown as KVNamespace } as Env
}

describe("WHOOP link status", function () {
  it("is connected while the access token is valid", async function () {
    assert.equal(await ownerStatus(env(Date.now() + 15 * 60_000)), "connected")
  })

  it("is expired once refresh has stopped keeping the token alive", async function () {
    assert.equal(await ownerStatus(env(Date.now() - 6 * 24 * 3_600_000)), "expired")
  })

  it("is missing before WHOOP is connected", async function () {
    assert.equal(await ownerStatus(env(null)), "missing")
  })
})
