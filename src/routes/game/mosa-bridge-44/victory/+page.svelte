<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { soundManager } from "$lib/utils/SoundManager";

    let gameContainer: any;

    // Alien apologies
    const apologies = [
        '"Sorry! De Maas is te nat!"',
        '"Wij komen in vrede... nu!"',
        '"Geen water meer, alstublieft!"',
        '"Wij gaan terug naar Mars!"',
        '"Sorry Lord Mosa!"',
    ];

    onMount(() => {
        soundManager.playWin();
    });

    async function handleHome() {
        goto("/game");
    }
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="mosa-victory"
    title="🏆 MISSIE GESLAAGD"
>
    <div class="victory-content" in:fade>
        <div class="hero-image">🦁🌊</div>

        <h2>MAASTRICHT IS VEILIG!</h2>

        <p class="story-text">
            Dankzij jouw snelle reacties bij de Servaasbrug zijn de aliens
            weggespoeld. Lord Mosa heeft de stad beschermd.
        </p>

        <div class="aliens-apology">
            <h3>👾 Berichten van de Aliens:</h3>
            <div class="chat-bubbles">
                {#each apologies as apology, i}
                    <div class="bubble" style:animation-delay="{i * 0.5}s">
                        {apology}
                    </div>
                {/each}
            </div>
        </div>

        <div class="actions">
            <button class="action-btn primary" onclick={handleHome}>
                TERUG NAAR DE KAART
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
        margin-bottom: 2rem;
    }

    .aliens-apology {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
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
