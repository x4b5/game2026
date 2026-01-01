<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";

    let gameContainer: any;
    let adminPassword = $state("");

    async function acceptBriefing() {
        // Proceed to next stage (Kazematten Scan)
        await fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navTo: "/game/rho-system-88/scan" }),
        });
        goto("/game/rho-system-88/scan");
    }

    function handleAdminBypass() {
        if (adminPassword.toLowerCase() === "xavier") {
            // ADMIN OVERRIDE: Skip scan, go to finale
            goto("/game/rho-system-88/finale");
        }
    }
</script>

<div class="scanlines"></div>
<div class="animated-bg"></div>

<GameContainer
    bind:this={gameContainer}
    gameId="rho-system"
    title="📡 Rho System 88"
>
    <div class="stream-game">
        <div class="intel-briefing" in:fade>
            <div class="briefing-header">
                <span class="alert-tag">⚠️ STATUS: UPDATE</span>
                <h1>MISSION UPDATE</h1>
            </div>

            <div class="briefing-content">
                <p class="intel-text">
                    <strong>> PREVIOUS MISSION:</strong>
                    <span class="highlight">SUCCESS</span>. Energieveld
                    geneutraliseerd. Kappa Grid is offline. Uitstekend werk,
                    agenten.
                </p>
                <p>
                    <strong>> NEW INTEL:</strong> Sensoren detecteren nu activiteit
                    in Sector **KAZEMATTEN**. The Minck vertoont ongebruikelijke
                    energie-pieken.
                </p>
                <p>
                    <strong>> OBJECTIVE:</strong> Verplaats onmiddellijk naar de
                    Kazematten. Zoek de
                    <span class="highlight"
                        >koudste plek van de laagste ruimte</span
                    >. Observeer en rapporteer.
                </p>
                <div class="warning-box">MOVE OUT. STAY FROSTY.</div>
            </div>

            <button class="accept-btn" onclick={acceptBriefing}>
                [ PROCEED TO TARGET ]
            </button>

            <div class="admin-container">
                <input
                    type="password"
                    class="admin-input"
                    bind:value={adminPassword}
                    placeholder="ADMIN OVERRIDE"
                    onkeydown={(e) => e.key === "Enter" && handleAdminBypass()}
                />
            </div>
        </div>
    </div>
</GameContainer>

<style>
    /* Military / Tactical Theme Global Overrides */
    :global(body) {
        background-color: #050505;
        color: #10b981;
    }

    /* Scanlines Overlay */
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

    /* Animated Background */
    .animated-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: radial-gradient(
                circle at center,
                transparent 30%,
                rgba(16, 185, 129, 0.05) 70%
            ),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(16, 185, 129, 0.03) 1px,
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

    /* Intel Briefing */
    .intel-briefing {
        background: rgba(10, 20, 15, 0.95);
        border: 2px solid #10b981;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
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
        background: #ef4444;
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
        border-bottom: 1px solid rgba(16, 185, 129, 0.3);
        padding-bottom: 0.5rem;
    }

    .briefing-content {
        margin: 1.5rem 0;
        line-height: 1.6;
        color: #10b981;
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
        background: rgba(239, 68, 68, 0.1);
        border: 1px dashed #ef4444;
        padding: 1rem;
        text-align: center;
        color: #ef4444;
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
        background: #10b981;
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
        background: #34d399;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
    }

    .admin-container {
        margin-top: 2rem;
        opacity: 0.1;
        transition: opacity 0.3s;
        text-align: center;
    }

    .admin-container:hover {
        opacity: 1;
    }

    .admin-input {
        background: transparent;
        border: 1px solid #10b981;
        color: #10b981;
        padding: 0.5rem;
        font-family: monospace;
        text-align: center;
        width: 150px;
    }
</style>
