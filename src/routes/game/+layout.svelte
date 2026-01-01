<script lang="ts">
    import { gameProgress } from "$lib/stores/gameStore";
    import "../../app.css";
    let { children } = $props();

    // Mapping for hero assets (must match the logic in +page.svelte)
    const heroAssets: Record<string, string> = {
        "lord-mosa": "/heroes/lord-mosa.png",
        stella: "/heroes/stella.png",
        "the-minck": "/heroes/the-minck.png",
    };

    let heroImage = $derived(
        $gameProgress.player?.avatar
            ? heroAssets[$gameProgress.player.avatar]
            : null,
    );
</script>

<div class="game-layout">
    <!-- Player HUD: Top Right -->
    {#if $gameProgress.player}
        <div class="player-hud glass-panel">
            <div class="hud-content">
                <div class="hud-avatar-container">
                    {#if heroImage}
                        <img src={heroImage} alt="Hero" class="hud-avatar" />
                    {:else}
                        <div class="hud-placeholder">?</div>
                    {/if}
                </div>
                <div class="hud-info">
                    <span class="hud-name">{$gameProgress.player.name}</span>
                    <span class="hud-player-num"
                        >P{$gameProgress.player.playerNumber}</span
                    >
                </div>
            </div>
        </div>
    {/if}

    <main>
        {@render children()}
    </main>
</div>

<style>
    .game-layout {
        min-height: 100vh;
        position: relative;
    }

    .player-hud {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        padding: 0.5rem 1rem 0.5rem 0.5rem;
        border-radius: 50px;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        animation: slideIn 0.5s ease-out;
    }

    .hud-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .hud-avatar-container {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hud-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hud-info {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
    }

    .hud-name {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .hud-player-num {
        font-family: "Inter", sans-serif;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 600;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @media (max-width: 480px) {
        .player-hud {
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.4rem 0.8rem 0.4rem 0.4rem;
        }

        .hud-avatar-container {
            width: 35px;
            height: 35px;
        }

        .hud-name {
            font-size: 0.8rem;
        }
    }
</style>
