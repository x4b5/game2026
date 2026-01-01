import { json } from '@sveltejs/kit';

// Global mission state (in-memory)
let currentMissionStep = "iota-stream";

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return json({ step: currentMissionStep });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { step } = await request.json();
    if (!step) return json({ error: 'Missing step' }, { status: 400 });

    currentMissionStep = step;
    return json({ success: true, step: currentMissionStep });
}
