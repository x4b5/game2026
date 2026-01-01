import { json } from '@sveltejs/kit';

// In-memory storage for player positions
// deviceId -> { path: string, lastSeen: number }
const playerPositions = new Map<string, { path: string, lastSeen: number }>();

// Ordered list of mission steps
const MISSION_ORDER = [
    '/game/kappa-grid-27',
    '/game/kappa-grid-27/challenge',
    '/game/iota-stream-6',
    '/game/iota-stream-6/burner',
    '/game/delta-vortex-11',
    '/game/gamma-prime-8',
    '/game/mosa-bridge-44',
    '/game/sigma-nexus-4',
    '/game/x7-alpha-92',
    '/game/theta-pulse-19',
    '/game/theta-pulse-19/track',
    '/game/theta-pulse-19/luca-scan',
    '/game/theta-pulse-19/airborne-concerto',
    '/game/theta-pulse-19/victory',
    '/game/zeta-flux-33',
    '/game/zeta-flux-33/circuit-overload',
    '/game/sint-pieter/scan',
    '/game/sint-pieter/safe',
    '/game/sint-pieter/victory',
    '/game/rho-system-88',
    '/game/rho-system-88/finale',
    '/game/omicron-base-victory'
];

function getPathIndex(path: string) {
    // Exact match
    let index = MISSION_ORDER.indexOf(path);
    if (index !== -1) return index;

    // Partial match (handles trailing slashes)
    const normalized = path.replace(/\/$/, '');
    index = MISSION_ORDER.indexOf(normalized);
    if (index !== -1) return index;

    // Not a tracked path, assume it's "before" the mission starts
    return -1;
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const now = Date.now();
    // Cleanup inactive players (older than 30 seconds)
    for (const [id, pos] of playerPositions.entries()) {
        if (now - pos.lastSeen > 30000) {
            playerPositions.delete(id);
        }
    }

    if (playerPositions.size === 0) {
        return json({ step: MISSION_ORDER[0], totalPlayers: 0 });
    }

    // Find the minimum index across all active players
    let minIndex = Infinity;
    for (const pos of playerPositions.values()) {
        const idx = getPathIndex(pos.path);
        // Only consider tracked paths for the "sync"
        if (idx !== -1) {
            minIndex = Math.min(minIndex, idx);
        }
    }

    // If no tracked paths found, default to start
    if (minIndex === Infinity) minIndex = 0;

    return json({
        step: MISSION_ORDER[minIndex],
        totalPlayers: playerPositions.size,
        allPaths: Array.from(playerPositions.values()).map(p => p.path)
    });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { deviceId, path } = await request.json();
    if (!deviceId || !path) return json({ error: 'Missing data' }, { status: 400 });

    playerPositions.set(deviceId, {
        path,
        lastSeen: Date.now()
    });

    return await GET();
}
