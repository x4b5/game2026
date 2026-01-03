<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";

    let visible = $state(false);
    let intelRevealed = $state(false);
    let showAlienImage = $state(false);
    let enlargedImage = $state(false);
    let isStella = $derived($gameProgress.player?.avatar === "stella");

    onMount(() => {
        visible = true;
        setTimeout(() => (intelRevealed = true), 1000);
    });

    async function handleContinue() {
        // Send everyone to the bridge
        await fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navTo: "/game/mosa-bridge-44" }),
        }).catch(console.error);

        goto("/game/mosa-bridge-44");
    }
</script>

<div class="victory-page" in:fade>
    <div class="background-overlay"></div>

    <div class="content-panel glass-panel">
        <div class="header" in:fly={{ y: -20, delay: 200 }}>
            <div class="badge">LUC-MISSION COMPLETED</div>
            <h1>VRIJTHOF IS VRIJ!</h1>
        </div>

        <div class="visual-container">
            <div
                class="stella-victory"
                in:scale={{ duration: 1000, delay: 400 }}
            >
                <span class="stella-icon">✨</span>
                <span class="violin-icon">🎻</span>
            </div>
            <div class="sonic-waves">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
        </div>

        <div class="report-section">
            {#if intelRevealed}
                <div class="report-box" in:fly={{ y: 20 }}>
                    <h3>UITSTEKEND WERK, STELLA!</h3>
                    <p>
                        De sonische pulsen van je vioolspel hebben de
                        alien-vloot volledig gedestabiliseerd. Het Vrijthof is
                        bevrijd!
                    </p>

                    <button
                        class="reveal-btn"
                        onclick={() => (showAlienImage = !showAlienImage)}
                    >
                        {showAlienImage
                            ? "🙈 VERBERG"
                            : "👀 WAT GEBEURDE ER MET DE ALIENS?"}
                    </button>

                    {#if showAlienImage}
                        <div class="alien-image-container">
                            <img
                                src="/alien-diarree.png"
                                alt="Alien Diarree"
                                class="alien-image"
                                onclick={() => (enlargedImage = true)}
                                role="button"
                                tabindex="0"
                            />
                            <p class="image-caption">
                                De aliens konden de sonische golven niet aan...
                                💩
                            </p>
                            <p class="tap-hint">🔍 Tap om te vergroten</p>
                        </div>
                    {/if}
                    <div class="objective-box warning">
                        <strong>WAARSCHUWING:</strong> Sensoren detecteren een
                        klein restant van de vloot. De aliens blijken te
                        vluchten naar <strong>Wyck</strong>!
                    </div>
                    <p class="final-words">
                        We kunnen ze niet laten ontkomen. Maak je klaar voor de
                        achtervolging!
                    </p>
                </div>

                <button class="final-btn" onclick={handleContinue}>
                    ACHTERVOLG DE ALIENS 🛸
                </button>
            {:else}
                <div class="decoding-text">SONISCHE ECHO'S ANALYSEREN...</div>
            {/if}
        </div>
    </div>
</div>

<!-- Lightbox Modal -->
{#if enlargedImage}
    <div class="lightbox" onclick={() => (enlargedImage = false)}>
        <button class="close-btn" onclick={() => (enlargedImage = false)}
            >✕</button
        >
        <img
            src="/alien-diarree.png"
            alt="Alien Diarree Vergroot"
            class="lightbox-image"
        />
        <p class="lightbox-caption">Tap ergens om te sluiten</p>
    </div>
{/if}

<style>
    .victory-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 1rem;
        background: #020617;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .background-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(59, 130, 246, 0.15) 0%,
            transparent 70%
        );
        pointer-events: none;
    }

    .content-panel {
        max-width: 600px;
        width: 100%;
        padding: 2.5rem 1.5rem;
        background: rgba(15, 23, 42, 0.9);
        border: 2px solid #3b82f6;
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        z-index: 1;
        border-radius: 24px;
        box-sizing: border-box;
    }

    .badge {
        display: inline-block;
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
        margin-bottom: 1rem;
        border: 1px solid #3b82f6;
        letter-spacing: 2px;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2.5rem;
        color: white;
        letter-spacing: 2px;
        margin: 0;
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }

    .visual-container {
        position: relative;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stella-victory {
        position: relative;
        z-index: 2;
    }

    .stella-icon {
        font-size: 5rem;
        display: block;
        animation: float 3s ease-in-out infinite;
    }

    .violin-icon {
        font-size: 2.5rem;
        position: absolute;
        bottom: -10px;
        right: -10px;
        filter: drop-shadow(0 0 10px #3b82f6);
        animation: float 3s ease-in-out infinite reverse;
    }

    .sonic-waves {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .wave {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid #3b82f6;
        border-radius: 50%;
        opacity: 0;
        animation: ripple 3s linear infinite;
    }

    .wave:nth-child(2) {
        animation-delay: 1s;
    }
    .wave:nth-child(3) {
        animation-delay: 2s;
    }

    .report-box {
        background: rgba(255, 255, 255, 0.03);
        padding: 2.5rem;
        border-radius: 20px;
        text-align: left;
        border-left: 4px solid #3b82f6;
    }

    h3 {
        font-family: "Orbitron", sans-serif;
        color: #60a5fa;
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
        letter-spacing: 1px;
    }

    p {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-size: 1.05rem;
    }

    .reveal-btn {
        width: 100%;
        padding: 1rem;
        background: rgba(168, 85, 247, 0.2);
        border: 2px solid #a855f7;
        border-radius: 12px;
        color: #c084fc;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s;
        margin-bottom: 1.5rem;
    }

    .reveal-btn:hover {
        background: rgba(168, 85, 247, 0.3);
        transform: scale(1.02);
    }

    .alien-image-container {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 16px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border: 2px solid #a855f7;
    }

    .alien-image {
        width: 100%;
        max-width: 400px;
        height: auto;
        border-radius: 12px;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .alien-image:hover {
        transform: scale(1.02);
    }

    .image-caption {
        color: #a855f7;
        font-size: 0.9rem;
        font-style: italic;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .tap-hint {
        color: #64748b;
        font-size: 0.8rem;
        text-align: center;
        margin: 0;
    }

    /* Lightbox Modal */
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
        cursor: pointer;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid white;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    .lightbox-image {
        max-width: 95%;
        max-height: 80vh;
        border-radius: 16px;
        box-shadow: 0 0 50px rgba(168, 85, 247, 0.5);
    }

    .lightbox-caption {
        color: #94a3b8;
        margin-top: 1rem;
        font-size: 0.9rem;
    }

    .objective-box {
        background: rgba(59, 130, 246, 0.1);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        margin-bottom: 1.5rem;
        border: 1px dashed rgba(59, 130, 246, 0.4);
        font-weight: 600;
    }

    .final-words {
        font-style: italic;
        color: #94a3b8;
        font-size: 0.95rem;
    }

    .final-btn {
        width: 100%;
        padding: 1.4rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 16px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.3rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        margin-top: 1rem;
        letter-spacing: 2px;
        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
    }

    .final-btn:hover {
        transform: scale(1.05) translateY(-5px);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.5);
        background: #2563eb;
    }

    .decoding-text {
        font-family: "Orbitron", sans-serif;
        color: #3b82f6;
        letter-spacing: 3px;
        animation: pulse 1.5s infinite;
        font-weight: 700;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-15px);
        }
    }

    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.8;
        }
        100% {
            width: 400px;
            height: 400px;
            opacity: 0;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.8rem;
        }

        .stella-icon {
            font-size: 3.5rem;
        }

        .violin-icon {
            font-size: 1.8rem;
        }

        .visual-container {
            height: 120px;
        }

        .report-box {
            padding: 1.5rem;
        }

        .final-btn {
            font-size: 1.1rem;
            padding: 1.2rem;
        }
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
    }
</style>
