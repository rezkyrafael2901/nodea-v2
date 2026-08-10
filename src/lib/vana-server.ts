/**
 * Vana Data Portability Controller Factory
 * Server-side only — NEVER import in browser code.
 */

import { createDirectDataController } from "@opendatalabs/vana-sdk/server";
import type { DirectDataController, DirectDataControllerConfig } from "@opendatalabs/vana-sdk/server";

const SOURCE_SCOPES: Record<string, { web: string[]; full: string[] }> = {
  github: {
    web: ["github.profile"],
    full: ["github.contributions", "github.events", "github.history", "github.profile", "github.repositories", "github.starred"],
  },
  instagram: {
    web: ["instagram.profile"],
    full: ["instagram.profile", "instagram.posts", "instagram.following", "instagram.ads"],
  },
  chatgpt: {
    web: ["chatgpt.conversations"],
    full: ["chatgpt.conversations", "chatgpt.memories"],
  },
  spotify: {
    web: ["spotify.profile"],
    full: ["spotify.playlists", "spotify.profile", "spotify.savedTracks"],
  },
  youtube: {
    web: ["youtube.profile"],
    full: ["youtube.history", "youtube.likes", "youtube.playlists", "youtube.profile", "youtube.subscriptions", "youtube.watchLater"],
  },
  steam: {
    web: ["steam.profile"],
    full: ["steam.profile", "steam.games", "steam.friends"],
  },
  linkedin: {
    web: ["linkedin.profile"],
    full: ["linkedin.profile", "linkedin.experience", "linkedin.education", "linkedin.skills"],
  },
};

export function getSourceScopes(sourceId: string, mode: "web" | "full" = "web"): string[] | null {
  const entry = SOURCE_SCOPES[sourceId];
  if (!entry) return null;
  return mode === "full" ? entry.full : entry.web;
}

export function isValidSource(sourceId: string): boolean {
  return sourceId in SOURCE_SCOPES;
}

export function createVanaController(sourceId: string, mode: "web" | "full" = "web"): DirectDataController {
  const scopes = getSourceScopes(sourceId, mode);
  if (!scopes) throw new Error(`Unknown source: ${sourceId}`);

  const config: DirectDataControllerConfig = {
    env: process.env.VANA_ENV === "dev" ? "dev" : "production",
    network: process.env.VANA_NETWORK === "moksha" ? "moksha" : "mainnet",
    appPrivateKey: process.env.VANA_APP_PRIVATE_KEY,
    app: {
      id: process.env.VANA_APP_ID || "nodea",
      name: process.env.VANA_APP_NAME || "Nodea",
      homepageUrl: process.env.VANA_APP_URL || "https://nodea.my.id",
    },
    source: sourceId,
    scopes,
    ...(process.env.VANA_DP_RPC_URL ? {
      escrow: {
        escrowContract: process.env.VANA_ESCROW_CONTRACT as `0x${string}` | undefined,
      },
    } : {}),
  };

  return createDirectDataController(config);
}

export function getAppIdentity() {
  const ctrl = createVanaController("github");
  return ctrl.getAppIdentity();
}
