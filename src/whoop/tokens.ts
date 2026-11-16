import type { Env } from "../env.ts"
import type { StoredTokens } from "./types.ts"

const KEY = "owner"

/** Load the single-tenant WHOOP token blob */
export async function loadOwner(env: Env): Promise<StoredTokens | null> {
  const raw = await env.WHOOP_TOKENS.get(KEY)
  if (!raw) {
    return null
  }
  return JSON.parse(raw) as StoredTokens
}

/** Persist the single-tenant WHOOP token blob */
export async function saveOwner(env: Env, tokens: StoredTokens): Promise<void> {
  await env.WHOOP_TOKENS.put(KEY, JSON.stringify(tokens))
}

/** Delete stored WHOOP tokens */
export async function clearOwner(env: Env): Promise<void> {
  await env.WHOOP_TOKENS.delete(KEY)
}

/**
 * WHOOP link state for /health. `expired` means the access token has lapsed: the cron refreshes
 * every 45 minutes or less and a token lasts about 59, so a healthy link never reaches it.
 * It usually means WHOOP rejected the refresh token and the owner must visit /connect.
 */
export async function ownerStatus(env: Env): Promise<"connected" | "expired" | "missing"> {
  const tokens = await loadOwner(env)
  if (!tokens) {
    return "missing"
  }
  return Date.now() >= tokens.expires_at ? "expired" : "connected"
}
