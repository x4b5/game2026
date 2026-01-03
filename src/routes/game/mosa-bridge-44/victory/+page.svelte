<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";

    let gameContainer: any;

    // Alien intercepts
    const intercepts = [
        '"Retreat naar sector Pottenberg!"',
        '"De anderen zijn ontsnapt..."',
        '"Coördinaten: 50.8421, 5.7012"',
        '"Ze hergroeperen zich!"',
        '"Laatste kans om te stoppen!"',
    ];

    onMount(() => {
        soundManager.playSuccess();
    });

    async function handleContinue() {
        goto("/game/rho-system-88/finale");
    }
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="mosa-victory"
    title="⚠️ GEDEELTELIJK SUCCES"
>
    <div class="victory-content" in:fade>
        <div class="hero-image">🌊💥👾</div>

        <h2>ALIENS WEGGESPOELD!</h2>

        <p class="story-text">
            Dankzij jouw snelle reacties bij de Servaasbrug zijn de meeste
            aliens weggespoeld. Maar <strong>wacht!</strong> Onze sensoren detecteren
            dat een aantal aliens zijn ontsnapt...
        </p>

        <div class="alert-box">
            <span class="alert-icon">🚨</span>
            <p>
                <strong>WAARSCHUWING:</strong> Ontsnapte aliens gelocaliseerd in
                <strong>POTTENBERG</strong>! Ze hergroeperen zich voor een
                tegenaanval.
            </p>
        </div>

        <div class="aliens-intercept">
            <h3>📡 Onderschepte Communicatie:</h3>
            <div class="chat-bubbles">
                {#each intercepts as message, i}
                    <div class="bubble" style:animation-delay="{i * 0.5}s">
                        {message}
                    </div>
                {/each}
            </div>
        </div>

        <p class="mission-text">
            Vertrek naar <strong>Pottenberg</strong> en los de puzzel op om de aliens
            op de juiste locatie te overmannen!
        </p>

        <div class="actions">
            <button class="action-btn primary" onclick={handleContinue}>
                🎯 NAAR POTTENBERG
            </button>
        </div>
    </div>
</GameContainer>

<style>
    .victory-content {
        text-align: center;
        color: white;
        padding: 1rem;
    }

    .hero-image {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    h2 {
        font-family: "Orbitron", sans-serif;
        color: #fbbf24;
        font-size: 1.8rem;
        margin-bottom: 1rem;
        text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
    }

    .story-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #e2e8f0;
        margin-bottom: 1.5rem;
    }

    .alert-box {
        background: rgba(239, 68, 68, 0.2);
        border: 2px solid #ef4444;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        text-align: left;
    }

    .alert-icon {
        font-size: 2rem;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .alert-box p {
        margin: 0;
        color: #fca5a5;
        font-size: 1rem;
        line-height: 1.5;
    }

    .mission-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #86efac;
        margin-bottom: 2rem;
        background: rgba(34, 197, 94, 0.1);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #22c55e;
    }

    .aliens-intercept {
        background: rgba(139, 92, 246, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(139, 92, 246, 0.3);
    }

    h3 {
        font-size: 1rem;
        color: #a78bfa;
        margin-bottom: 1rem;
        font-family: "Orbitron", sans-serif;
    }

    .chat-bubbles {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .bubble {
        background: #4c1d95;
        color: #e9d5ff;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        font-size: 0.9rem;
        align-self: center;
        opacity: 0;
        animation: fade-in-up 0.5s forwards;
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .actions {
        margin-top: 2rem;
    }

    .action-btn {
        padding: 1rem 2rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        width: 100%;
        font-size: 1.1rem;
    }

    .action-btn.primary {
        background: #fbbf24;
        color: #1e1b4b;
        box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
    }

    .action-btn:hover {
        transform: scale(1.02);
        filter: brightness(1.1);
    }
</style>
