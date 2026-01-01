import { writable } from 'svelte/store';

export interface PlayerData {
    name: string;
    avatar: string;  // Avatar identifier
    playerNumber: number;  // 1-6
    joinedAt: number;  // Timestamp
}

export interface GameProgress {
    completed: string[];  // Game IDs that are completed
    scores: Record<string, number>;  // High scores per game
    totalScore: number;
    player?: PlayerData;  // Current player info
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
        setPlayer: (playerData: PlayerData) =>
            update(state => {
                const newState = {
                    ...state,
                    player: playerData
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

export const MISSION_ORDER = [
    '/game/kappa-grid-27',
    '/game/kappa-grid-27/challenge',
    '/game/iota-stream-6',
    '/game/iota-stream-6/burner',
    '/game/omicron-base-victory',
    '/game/sint-pieter/safe',
    '/game/sint-pieter/victory',
    '/game/sint-pieter/scan',
    '/game/theta-pulse-19',
    '/game/theta-pulse-19/track',
    '/game/theta-pulse-19/luca-scan',
    '/game/theta-pulse-19/airborne-concerto',
    '/game/theta-pulse-19/victory',
    '/game/delta-vortex-11',
    '/game/gamma-prime-8',
    '/game/mosa-bridge-44',
    '/game/sigma-nexus-4',
    '/game/x7-alpha-92',
    '/game/zeta-flux-33',
    '/game/zeta-flux-33/circuit-overload',
    '/game/rho-system-88',
    '/game/rho-system-88/finale'
];
