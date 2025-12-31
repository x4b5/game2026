import { writable } from 'svelte/store';

export interface GameProgress {
    completed: string[];  // Game IDs that are completed
    scores: Record<string, number>;  // High scores per game
    totalScore: number;
}

function createGameStore() {
    const stored = typeof window !== 'undefined'
        ? localStorage.getItem('game2026_progress')
        : null;

    const initial: GameProgress = stored
        ? JSON.parse(stored)
        : { completed: [], scores: {}, totalScore: 0 };

    const { subscribe, set, update } = writable<GameProgress>(initial);

    return {
        subscribe,
        completeGame: (gameId: string, score: number) =>
            update(state => {
                const newCompleted = state.completed.includes(gameId)
                    ? state.completed
                    : [...state.completed, gameId];

                const previousScore = state.scores[gameId] || 0;
                const newScore = Math.max(previousScore, score);
                const scoreDiff = newScore - previousScore;

                const newState = {
                    completed: newCompleted,
                    scores: { ...state.scores, [gameId]: newScore },
                    totalScore: state.totalScore + scoreDiff
                };

                if (typeof window !== 'undefined') {
                    localStorage.setItem('game2026_progress', JSON.stringify(newState));
                }

                return newState;
            }),
        reset: () => {
            const newState = { completed: [], scores: {}, totalScore: 0 };
            set(newState);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('game2026_progress');
            }
        }
    };
}

export const gameProgress = createGameStore();
