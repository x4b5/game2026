import { json } from '@sveltejs/kit';

// Global navigation override
// If this is set, all clients will be redirected to this path
let navOverride: { path: string, timestamp: number } | null = null;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    // If override is older than 15 seconds, clear it to prevent loops
    if (navOverride && Date.now() - navOverride.timestamp > 15000) {
        navOverride = null;
    }

    return json({ navTo: navOverride?.path || null });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { navTo } = await request.json();

    if (navTo) {
        navOverride = {
            path: navTo,
            timestamp: Date.now()
        };
    }

    return json({ success: true, navTo: navOverride?.path || null });
}
