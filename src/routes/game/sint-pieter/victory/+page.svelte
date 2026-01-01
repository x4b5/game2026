<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);
    let intelRevealed = $state(false);

    onMount(() => {
        visible = true;
        setTimeout(() => (intelRevealed = true), 1000);
    });

    async function handleNextMission() {
        try {
            // Update global mission state to the next phase
            await fetch("/api/mission", {
                method: "POST",
                body: JSON.stringify({ step: "final-stand" }),
            });
        } catch (e) {
            console.error(e);
        }
        goto("/game");
    }
</script>

<div class="victory-page" in:fade>
    <div class="content-panel glass-panel">
        <div class="header">
            <div class="badge">MISSIE VOLTOOID</div>
            <h1>DE VIOOL IS BEVRIJD!</h1>
        </div>

        <div class="visual-container">
            <div class="violin-glow">🎻</div>
            <div class="energy-rings">
                <div class="ring"></div>
                <div class="ring"></div>
                <div class="ring"></div>
            </div>
        </div>

        <div class="report-section">
            {#if intelRevealed}
                <div class="report-box" in:fly={{ y: 20 }}>
                    <h3>NIEUWE OPDRACHT: DE FINALE</h3>
                    <p>
                        Agenten, uitstekend werk. De viool van André Rieu is in
                        veiligheid. Sensoren vangen nu een massale
                        alien-concentratie op bij het <strong>Vrijthof</strong>.
                    </p>
                    <div class="objective-box">
                        <strong>DOEL:</strong> Gebruik de sonische kracht van de
                        viool om de alien-moederschepen permanent te verjagen.
                    </div>
                    <p class="warning">
                        ⚠️ <strong>LET OP:</strong> De aliens zullen alles doen om
                        dit concert van de ondergang te stoppen. Wees voorbereid
                        op de ultieme confrontatie!
                    </p>
                </div>

                <button class="final-btn" onclick={handleNextMission}>
                    NAAR HET VRIJTHOF 🚀
                </button>
            {:else}
                <div class="decoding-text">
                    ANALYSEREN SONISCHE FREQUENTIES...
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .victory-page {
        min-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
    }

    .content-panel {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(0, 0, 0, 0.85);
        border: 2px solid #fbbf24;
        box-shadow: 0 0 50px rgba(251, 191, 36, 0.2);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .badge {
        display: inline-block;
        background: rgba(251, 191, 36, 0.2);
        color: #fbbf24;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.8rem;
        margin-bottom: 1rem;
        border: 1px solid #fbbf24;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2.2rem;
        color: white;
        letter-spacing: 2px;
    }

    .visual-container {
        position: relative;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .violin-glow {
        font-size: 5rem;
        filter: drop-shadow(0 0 20px #fbbf24);
        z-index: 2;
        animation: float 3s ease-in-out infinite;
    }

    .energy-rings {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid #fbbf24;
        border-radius: 50%;
        opacity: 0;
        animation: ripple 3s linear infinite;
    }

    .ring:nth-child(2) {
        animation-delay: 1s;
    }
    .ring:nth-child(3) {
        animation-delay: 2s;
    }

    .report-box {
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 16px;
        text-align: left;
        border-left: 4px solid #fbbf24;
    }

    h3 {
        font-family: "Orbitron", sans-serif;
        color: #fbbf24;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    }

    p {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .objective-box {
        background: rgba(251, 191, 36, 0.1);
        padding: 1rem;
        border-radius: 8px;
        color: white;
        margin-bottom: 1.5rem;
        border: 1px dashed rgba(251, 191, 36, 0.4);
    }

    .warning {
        color: #f87171;
        font-size: 0.9rem;
    }

    .final-btn {
        width: 100%;
        padding: 1.2rem;
        background: #fbbf24;
        color: black;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 2rem;
    }

    .final-btn:hover {
        transform: scale(1.02);
        box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
    }

    .decoding-text {
        font-family: "Orbitron", sans-serif;
        color: #fbbf24;
        letter-spacing: 2px;
        animation: pulse 1.5s infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.8;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
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
</style>
