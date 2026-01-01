<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide, scale } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);
    let missionStarted = $state(false);
    let chargingStatus = $state(0);

    onMount(() => {
        visible = true;
        const interval = setInterval(() => {
            if (chargingStatus < 100) chargingStatus += 1;
            else clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    });

    function startFinalAssault() {
        missionStarted = true;
        setTimeout(() => {
            // This would lead to the actual game logic/mini-game
            goto("/game/theta-pulse-19/airborne-concerto");
        }, 2000);
    }
</script>

<div class="mission-page" in:fade>
    <div class="background-overlay"></div>

    <div class="content-wrapper">
        <header in:fly={{ y: -50, delay: 200 }}>
            <div class="mission-tag">OPERATIE: SONISCHE STORM</div>
            <h1>THETA PULSE 19</h1>
        </header>

        <main>
            <div class="hero-briefing" in:fly={{ x: -30, delay: 400 }}>
                <div class="hero-avatar">
                    <span class="stella-icon">✨</span>
                    <div class="halo"></div>
                </div>
                <div class="briefing-text">
                    <h2>AGENT: STELLA</h2>
                    <p>
                        Stella, jij bent de enige die deze missie kan
                        volbrengen. Jouw vermogen om te vliegen gecombineerd met
                        je muzikale talent is de sleutel tot onze overwinning.
                    </p>
                    <div class="intel-box">
                        <span class="icon">🎻</span>
                        <div class="text">
                            <strong>MICROFOON VERSTERKING:</strong> De viool van
                            André Rieu is gekoppeld aan je sonische pak. De klanken
                            worden met 500% versterkt.
                        </div>
                    </div>
                </div>
            </div>

            <div class="mission-objective" in:fly={{ x: 30, delay: 600 }}>
                <div class="vrijthof-map">
                    <div class="scanner-line"></div>
                    <div class="target-dots">
                        <div class="dot" style="top: 20%; left: 30%"></div>
                        <div class="dot" style="top: 50%; left: 70%"></div>
                        <div class="dot" style="top: 80%; left: 40%"></div>
                    </div>
                </div>
                <h3>DOELWIT: VRIJTHOF</h3>
                <p>
                    Vlieg over het plein en slinger de vioolklanken in elke
                    hoek. De aliens op de grond en in de schepen boven de Sint
                    Servaasbasiliek moeten worden uitgeschakeld.
                </p>
            </div>
        </main>

        <footer in:fly={{ y: 50, delay: 800 }}>
            <div class="system-ready">
                <div class="charge-bar">
                    <div class="fill" style="width: {chargingStatus}%"></div>
                </div>
                <span class="status-msg"
                    >SYSTEMS: {chargingStatus === 100
                        ? "OPTIMAL"
                        : "CHARGING..."}</span
                >
            </div>

            <button
                class="start-btn"
                class:ready={chargingStatus === 100}
                disabled={chargingStatus < 100 || missionStarted}
                onclick={startFinalAssault}
            >
                {#if missionStarted}
                    STARTING AIRBORNE CONCERTO...
                {:else}
                    STIJG OP & SPEEL 🚀🎻
                {/if}
            </button>
        </footer>
    </div>
</div>

{#if missionStarted}
    <div class="transition-overlay" out:fade={{ duration: 500 }}>
        <div class="concerto-preview" in:scale>
            <span class="violin-symbol">🎻</span>
            <div class="sonic-waves">
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>
{/if}

<style>
    .mission-page {
        min-height: 100vh;
        background: #020617;
        color: white;
        font-family: "Inter", sans-serif;
        display: flex;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }

    .background-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(59, 130, 246, 0.1) 0%,
            transparent 70%
        );
        pointer-events: none;
    }

    .content-wrapper {
        max-width: 800px;
        width: 100%;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        z-index: 1;
    }

    header {
        text-align: center;
    }

    .mission-tag {
        font-family: "Orbitron", sans-serif;
        color: #3b82f6;
        font-size: 0.8rem;
        letter-spacing: 4px;
        margin-bottom: 0.5rem;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 3rem;
        font-weight: 900;
        margin: 0;
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }

    main {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 2rem;
        align-items: center;
    }

    .hero-briefing {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        padding: 2rem;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .hero-avatar {
        width: 80px;
        height: 80px;
        background: #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        align-self: center;
    }

    .stella-icon {
        font-size: 2.5rem;
        z-index: 2;
    }

    .halo {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid #3b82f6;
        animation: pulse-halo 2s infinite;
    }

    @keyframes pulse-halo {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    .briefing-text h2 {
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        color: #60a5fa;
        margin-bottom: 1rem;
        text-align: center;
    }

    .briefing-text p {
        color: #94a3b8;
        line-height: 1.6;
        font-size: 0.95rem;
    }

    .intel-box {
        margin-top: 1.5rem;
        background: rgba(59, 130, 246, 0.1);
        padding: 1rem;
        border-radius: 12px;
        display: flex;
        gap: 1rem;
        align-items: center;
        border: 1px dashed rgba(59, 130, 246, 0.3);
    }

    .intel-box .icon {
        font-size: 1.5rem;
    }

    .intel-box .text {
        font-size: 0.85rem;
        color: #dbeafe;
    }

    .mission-objective {
        background: rgba(0, 0, 0, 0.4);
        padding: 2rem;
        border-radius: 24px;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .vrijthof-map {
        height: 200px;
        background: #0f172a;
        margin-bottom: 1.5rem;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        border: 1px solid #1e293b;
    }

    .scanner-line {
        position: absolute;
        width: 100%;
        height: 2px;
        background: #3b82f6;
        box-shadow: 0 0 10px #3b82f6;
        top: 0;
        animation: scan-vertical 4s linear infinite;
    }

    @keyframes scan-vertical {
        0% {
            top: 0;
        }
        100% {
            top: 100%;
        }
    }

    .target-dots .dot {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #ef4444;
        border-radius: 50%;
        box-shadow: 0 0 15px #ef4444;
        animation: pulse-dot 1.5s infinite;
    }

    @keyframes pulse-dot {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .mission-objective h3 {
        font-family: "Orbitron", sans-serif;
        color: #f87171;
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }

    .mission-objective p {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.6;
    }

    footer {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .system-ready {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }

    .charge-bar {
        width: 100%;
        height: 8px;
        background: #1e293b;
        border-radius: 4px;
        overflow: hidden;
    }

    .charge-bar .fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.1s linear;
        box-shadow: 0 0 10px #3b82f6;
    }

    .status-msg {
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        color: #64748b;
        letter-spacing: 2px;
    }

    .start-btn {
        padding: 1.5rem;
        background: #1e293b;
        color: #475569;
        border: none;
        border-radius: 16px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        cursor: not-allowed;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .start-btn.ready {
        background: #3b82f6;
        color: white;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    }

    .start-btn.ready:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
    }

    .transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #020617;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .concerto-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .violin-symbol {
        font-size: 6rem;
        filter: drop-shadow(0 0 20px #3b82f6);
    }

    .sonic-waves {
        display: flex;
        gap: 10px;
        height: 40px;
        align-items: center;
    }

    .sonic-waves span {
        width: 6px;
        height: 20px;
        background: #3b82f6;
        border-radius: 3px;
        animation: wave-bounce 0.8s infinite ease-in-out;
    }

    .sonic-waves span:nth-child(2) {
        animation-delay: 0.2s;
    }
    .sonic-waves span:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes wave-bounce {
        0%,
        100% {
            height: 20px;
        }
        50% {
            height: 40px;
        }
    }

    @media (max-width: 768px) {
        main {
            grid-template-columns: 1fr;
        }

        h1 {
            font-size: 2.2rem;
        }
    }
</style>
