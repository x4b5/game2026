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

    onMount(() => {
        // Simple ping to let server know we are active (optional)
        const deviceId = localStorage.getItem("game2026_deviceId") || "unknown";
        fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId, path: $page.url.pathname }),
        }).catch(() => {});

        // "Follow the Leader" synchronization
        const syncInterval = setInterval(async () => {
            try {
                const res = await fetch("/api/mission");
                if (!res.ok) return;

                const data = await res.json();

                if (data.navTo) {
                    const currentPath = $page.url.pathname.replace(/\/$/, "");
                    const targetPath = data.navTo.replace(/\/$/, "");

                    if (currentPath === targetPath) return;

                    const currentIdx = MISSION_ORDER.indexOf(currentPath);
                    const targetIdx = MISSION_ORDER.indexOf(targetPath);

                    // ONLY move forward:
                    // 1. If we are not in the mission yet (currentIdx === -1)
                    // 2. OR if the target is further ahead than we are
                    if (currentIdx === -1 || targetIdx > currentIdx) {
                        goto(data.navTo);
                    }
                }
            } catch (e) {
                // Silent catch for network hiccups
            }
        }, 3000);

        return () => clearInterval(syncInterval);
    });
</script>

<div class="game-layout">
    <main>
        {@render children()}
    </main>
    <div class="version-tag">v2.1</div>
</div>

<style>
    .version-tag {
        position: fixed;
        bottom: 5px;
        right: 5px;
        color: rgba(255, 255, 255, 0.2);
        font-size: 0.6rem;
        pointer-events: none;
        z-index: 9999;
        font-family: monospace;
    }

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
