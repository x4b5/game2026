<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";

    let gameContainer: any;

    function proceed() {
        goto("/game/sint-pieter/safe");
    }
</script>

<div class="scanlines"></div>
<div class="animated-bg"></div>

<GameContainer
    bind:this={gameContainer}
    gameId="zeta-flux"
    title="⚡ Zeta Flux"
>
    <!-- Briefing Container reused styling structure -->
    <div class="stream-game">
        <div class="intel-briefing" in:fade>
            <div class="briefing-header">
                <span class="alert-tag">⚠️ NIEUWE INTEL</span>
                <h1>DECRYPTIE VOLTOOID</h1>
            </div>

            <div class="briefing-content">
                <p class="intel-text">
                    <strong>> ANALYSE:</strong> De data uit Omicron Base onthult
                    een kritieke zwakte. De aliens hebben de
                    <strong>viool van André Rieu</strong> gestolen.
                </p>
                <p>
                    <strong>> EFFECT:</strong> Onderschepte bio-data toont aan
                    dat de aliens fysiek instorten bij het horen van zijn
                    muziek. De vioolklanken veroorzaken acute
                    <span class="highlight">gastro-intestinale verstoring</span>
                    (diarree) bij de vijand.
                </p>
                <p>
                    <strong>> DOEL:</strong> Dit is ons biologische wapen! We
                    moeten de viool vinden. Hack de Zeta Flux terminal om de
                    locatie in <strong>Sint Pieter</strong> te bevestigen.
                </p>
                <div class="warning-box">
                    PRIORITY ALPHA: RETRIEVE THE VIOLIN.
                </div>
            </div>

            <button class="accept-btn" onclick={proceed}>
                [ START TERMINAL HACK ]
            </button>
        </div>
    </div>
</GameContainer>

<style>
    :global(body) {
        background-color: #050505;
        color: #10b981;
    }

    .scanlines {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
        );
        pointer-events: none;
        z-index: 10;
        opacity: 0.7;
    }

    .animated-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: radial-gradient(
                circle at center,
                transparent 30%,
                rgba(59, 130, 246, 0.05) 70%
            ),
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.03) 1px,
                transparent 1px
            );
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -1;
    }

    .stream-game {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        font-family: "Courier New", Courier, monospace;
        position: relative;
        z-index: 20;
    }

    .intel-briefing {
        background: rgba(10, 20, 30, 0.95);
        border: 2px solid #3b82f6;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
        clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            20px 100%,
            0 calc(100% - 20px)
        );
    }

    .alert-tag {
        display: inline-block;
        background: #3b82f6;
        color: #000;
        padding: 2px 8px;
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        font-weight: 900;
        margin-bottom: 0.5rem;
    }

    .briefing-header h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        color: #fff;
        margin: 0;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(59, 130, 246, 0.3);
        padding-bottom: 0.5rem;
    }

    .briefing-content {
        margin: 1.5rem 0;
        line-height: 1.6;
        color: #93c5fd;
        font-size: 0.95rem;
    }

    .intel-text {
        margin-bottom: 1rem;
    }

    .highlight {
        color: #fff;
        font-weight: bold;
    }

    .warning-box {
        background: rgba(59, 130, 246, 0.1);
        border: 1px dashed #3b82f6;
        padding: 1rem;
        text-align: center;
        color: #3b82f6;
        font-weight: 700;
        font-family: "Orbitron", sans-serif;
        margin-top: 1.5rem;
        animation: blink 2s infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0.5;
        }
    }

    .accept-btn {
        width: 100%;
        padding: 1.2rem;
        background: #3b82f6;
        color: #000;
        border: none;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.2s;
        letter-spacing: 1px;
        text-transform: uppercase;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
    }

    .accept-btn:hover {
        background: #60a5fa;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
    }
</style>
