import { redirect } from '@sveltejs/kit';

/**
 * Redirect the base /game route to the kappa-grid-27 welcome page.
 * This ensures that when a user navigates to /game, they land directly on the
 * superhero welcome page.
 */
export function load() {
    throw redirect(302, '/game/kappa-grid-27');
}
