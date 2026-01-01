<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";
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

    let currentSlowestPath = $state("");
    let isSpeeding = $state(false);

    onMount(() => {
        // Ensure unique device ID
        let deviceId = localStorage.getItem("game2026_deviceId");
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem("game2026_deviceId", deviceId);
        }

        const syncInterval = setInterval(async () => {
            try {
                const myPath = $page.url.pathname.replace(/\/$/, "");

                const res = await fetch("/api/mission", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        deviceId,
                        path: myPath,
                    }),
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.step) {
                        const slowPath = data.step.replace(/\/$/, "");
                        const myIdx = MISSION_ORDER.indexOf(myPath);
                        const slowIdx = MISSION_ORDER.indexOf(slowPath);

                        // Only block if we are actually FURTHER than the slowest player
                        if (myIdx !== -1 && slowIdx !== -1 && myIdx > slowIdx) {
                            isSpeeding = true;
                            currentSlowestPath = data.step;
                        } else {
                            isSpeeding = false;
                        }

                        // Forced move to victory if slowest player is there
                        if (
                            data.step === "/game/omicron-base-victory" &&
                            !myPath.includes("omicron-base-victory")
                        ) {
                            goto("/game/omicron-base-victory");
                        }
                    } else {
                        isSpeeding = false;
                    }
                }
            } catch (e) {
                console.error("Sync failed:", e);
            }
        }, 2000); // More frequent sync for better responsiveness

        return () => clearInterval(syncInterval);
    });
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

    <!-- Speeding Blocker -->
    {#if isSpeeding}
        <div class="sync-blocker">
            <div class="blocker-content glass-panel">
                <div class="warning-icon">⏳</div>
                <h2>WACHT OP JE TEAM</h2>
                <p>Nog niet alle agenten zijn klaar voor de volgende stap.</p>
                <div class="status-box">
                    <span>Huidige team-locatie:</span>
                    <strong class="location-tag"
                        >{currentSlowestPath
                            .split("/")
                            .pop()
                            ?.replace(/-/g, " ")}</strong
                    >
                </div>
                <div class="sync-loader">
                    <div class="bar"></div>
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

    /* Sync Blocker Overlay */
    .sync-blocker {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(15px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
    }

    .blocker-content {
        max-width: 400px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(15, 23, 42, 0.8);
        border: 2px solid var(--primary);
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .warning-icon {
        font-size: 4rem;
        margin-bottom: 0.5rem;
        animation: spin 3s linear infinite;
    }

    .blocker-content h2 {
        font-family: "Orbitron", sans-serif;
        color: white;
        font-size: 1.5rem;
        letter-spacing: 2px;
        margin: 0;
    }

    .blocker-content p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 1rem;
        line-height: 1.5;
        margin: 0;
    }

    .status-box {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .status-box span {
        font-size: 0.8rem;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.5);
    }

    .location-tag {
        font-family: "Orbitron", sans-serif;
        color: var(--primary);
        font-size: 1.1rem;
        text-transform: uppercase;
    }

    .sync-loader {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .sync-loader .bar {
        height: 100%;
        width: 40%;
        background: var(--primary);
        animation: slide 1.5s ease-in-out infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes slide {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(250%);
        }
    }
</style>
