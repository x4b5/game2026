<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";

    interface Card {
        id: number;
        symbol: string;
        isFlipped: boolean;
        isMatched: boolean;
        isGlitching: boolean;
    }

    let gameContainer: any;
    let cards = $state<Card[]>([]);
    let flippedCards = $state<number[]>([]);
    let timeLeft = $state(60);
    let matchesFound = $state(0);
    let canFlip = $state(true);
    let timerInterval: any;

    const symbols = ["⚡", "🧬", "🔬", "🔮", "💎", "🌀", "⚛️", "🔋"];
    const glitchSymbols = ["💥", "✨", "⭐", "🌟"];

    onMount(() => {
        initGame();
        startTimer();
        return () => clearInterval(timerInterval);
    });

    function initGame() {
        const cardPairs = symbols.flatMap((symbol, i) => [
            {
                id: i * 2,
                symbol,
                isFlipped: false,
                isMatched: false,
                isGlitching: false,
            },
            {
                id: i * 2 + 1,
                symbol,
                isFlipped: false,
                isMatched: false,
                isGlitching: false,
            },
        ]);

        // Shuffle
        cards = cardPairs.sort(() => Math.random() - 0.5);

        // Random glitch effect
        setInterval(() => {
            if (Math.random() < 0.3 && cards.some((c) => !c.isMatched)) {
                const unmatched = cards.filter(
                    (c) => !c.isMatched && !c.isFlipped,
                );
                if (unmatched.length > 0) {
                    const randomCard =
                        unmatched[Math.floor(Math.random() * unmatched.length)];
                    startGlitch(randomCard.id);
                }
            }
        }, 2000);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameContainer?.lose();
            }
        }, 1000);
    }

    function startGlitch(cardId: number) {
        const cardIndex = cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return;

        cards[cardIndex].isGlitching = true;
        const originalSymbol = cards[cardIndex].symbol;

        // Glitch animation
        let glitchCount = 0;
        const glitchInterval = setInterval(() => {
            if (glitchCount >= 6) {
                clearInterval(glitchInterval);
                cards[cardIndex].symbol = originalSymbol;
                cards[cardIndex].isGlitching = false;
                return;
            }

            cards[cardIndex].symbol =
                glitchCount % 2 === 0
                    ? glitchSymbols[
                          Math.floor(Math.random() * glitchSymbols.length)
                      ]
                    : originalSymbol;
            glitchCount++;
        }, 150);
    }

    function handleCardClick(cardId: number) {
        if (!canFlip) return;

        const card = cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        soundManager.playClick();
        card.isFlipped = true;
        flippedCards = [...flippedCards, cardId];

        if (flippedCards.length === 2) {
            canFlip = false;
            checkMatch();
        }
    }

    function checkMatch() {
        const [id1, id2] = flippedCards;
        const card1 = cards.find((c) => c.id === id1);
        const card2 = cards.find((c) => c.id === id2);

        if (!card1 || !card2) return;

        setTimeout(() => {
            if (card1.symbol === card2.symbol) {
                // Match!
                card1.isMatched = true;
                card2.isMatched = true;
                matchesFound++;
                soundManager.playSuccess();

                if (matchesFound === 8) {
                    clearInterval(timerInterval);
                    const score = Math.max(1000, timeLeft * 50);
                    gameContainer?.win(score);
                }
            } else {
                // No match
                card1.isFlipped = false;
                card2.isFlipped = false;
                soundManager.playError();
            }

            flippedCards = [];
            canFlip = true;
        }, 800);
    }
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="nexus-core"
    title="🧠 Nexus Core"
>
    <div class="memory-game">
        <div class="game-stats">
            <div class="stat">
                <span class="stat-label">Tijd</span>
                <span class="stat-value" class:warning={timeLeft < 15}
                    >{timeLeft}s</span
                >
            </div>
            <div class="stat">
                <span class="stat-label">Matches</span>
                <span class="stat-value">{matchesFound}/8</span>
            </div>
        </div>

        <div class="card-grid">
            {#each cards as card}
                <button
                    class="neural-card"
                    class:flipped={card.isFlipped || card.isMatched}
                    class:matched={card.isMatched}
                    class:glitching={card.isGlitching}
                    onclick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched || !canFlip}
                >
                    <div class="card-inner">
                        <div class="card-front">
                            <div class="circuit-pattern"></div>
                            <span class="card-back-text">?</span>
                        </div>
                        <div class="card-back">
                            <span class="card-symbol">{card.symbol}</span>
                        </div>
                    </div>
                </button>
            {/each}
        </div>

        <div class="hint">
            Let op: Symbolen kunnen glitchen en tijdelijk veranderen!
        </div>
    </div>
</GameContainer>

<style>
    .memory-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .game-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: var(--glass);
        border-radius: 12px;
        border: 1px solid var(--glass-border);
        flex: 1;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary);
    }

    .stat-value.warning {
        color: #ef4444;
        animation: pulse-warning 1s ease-in-out infinite;
    }

    @keyframes pulse-warning {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .neural-card {
        aspect-ratio: 1;
        perspective: 1000px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }

    .neural-card.flipped .card-inner {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--glass-border);
    }

    .card-front {
        background: var(--glass);
        position: relative;
        overflow: hidden;
    }

    .circuit-pattern {
        position: absolute;
        inset: 0;
        background: linear-gradient(
                90deg,
                transparent 48%,
                rgba(99, 102, 241, 0.2) 49%,
                rgba(99, 102, 241, 0.2) 51%,
                transparent 52%
            ),
            linear-gradient(
                0deg,
                transparent 48%,
                rgba(99, 102, 241, 0.2) 49%,
                rgba(99, 102, 241, 0.2) 51%,
                transparent 52%
            );
        background-size: 20px 20px;
    }

    .card-back-text {
        font-size: 2rem;
        color: var(--primary);
        z-index: 1;
    }

    .card-back {
        background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.3),
            rgba(236, 72, 153, 0.3)
        );
        transform: rotateY(180deg);
    }

    .card-symbol {
        font-size: 2.5rem;
    }

    .neural-card.matched .card-back {
        background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.3),
            rgba(16, 185, 129, 0.3)
        );
        border-color: #22c55e;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
    }

    .neural-card.glitching {
        animation: glitch 0.3s ease-in-out;
    }

    @keyframes glitch {
        0%,
        100% {
            transform: translate(0, 0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(2px, -2px);
        }
        60% {
            transform: translate(-2px, -2px);
        }
        80% {
            transform: translate(2px, 2px);
        }
    }

    .hint {
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-muted);
        font-style: italic;
    }

    @media (max-width: 640px) {
        .card-grid {
            gap: 0.5rem;
        }

        .card-symbol {
            font-size: 2rem;
        }
    }
</style>
