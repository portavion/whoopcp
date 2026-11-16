export interface Env {
  WHOOP_TOKENS: KVNamespace
  WHOOP_CLIENT_ID: string
  WHOOP_CLIENT_SECRET: string
  MCP_TOKEN: string
  /** Comma-separated extra bearer tokens for /mcp, one per client, so a client can be revoked alone */
  MCP_CLIENT_TOKENS?: string
  CONNECT_TOKEN?: string
  WHOOP_REDIRECT_URI: string
}
