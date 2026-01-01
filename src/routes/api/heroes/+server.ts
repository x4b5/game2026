import { json } from '@sveltejs/kit';

// In-memory storage for claimed heroes: heroId -> deviceId
// Note: This resets when the server restarts. Ideally, use a database or Redis for persistence.
const claimedHeroes = new Map<string, string>();

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    // Return list of claimed hero IDs
    const taken = Array.from(claimedHeroes.keys());
    return json({ taken });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { heroId, deviceId } = await request.json();

    if (!heroId || !deviceId) {
        return json({ error: 'Missing heroId or deviceId' }, { status: 400 });
    }

    const currentOwner = claimedHeroes.get(heroId);

    // If hero is free, or already owned by this device => Claim success
    if (!currentOwner || currentOwner === deviceId) {
        // If this device had another hero, release it first (optional rule, enforces 1 hero per device)
        for (const [h, d] of claimedHeroes.entries()) {
            if (d === deviceId && h !== heroId) {
                claimedHeroes.delete(h);
            }
        }

        claimedHeroes.set(heroId, deviceId);
        return json({ success: true, status: 'claimed' });
    }

    // Hero is taken by someone else
    return json({ success: false, error: 'Hero already taken' }, { status: 409 });
}
