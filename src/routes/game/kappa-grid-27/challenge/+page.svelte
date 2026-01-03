<script lang="ts">
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);
    let showExtraInfo = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location (Zolder/Start)
    const VALID_CODES = ["zet-uit"];

    onMount(() => {
        visible = true;
    });

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";

            // Navigate to next mission after brief delay
            setTimeout(() => {
                const currentPath = window.location.pathname.replace(/\/$/, "");
                const idx = MISSION_ORDER.indexOf(currentPath);
                if (idx !== -1 && idx < MISSION_ORDER.length - 1) {
                    const nextPath = MISSION_ORDER[idx + 1];
                    fetch("/api/mission", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ navTo: nextPath }),
                    }).catch(console.error);
                    goto(nextPath);
                } else {
                    goto("/game/rho-system-88");
                }
            }, 1000);
        } else {
            errorMessage = "Onjuiste code. Zoek goed rond in de ruimte!";
            showSuccess = false;
        }
    }
</script>

<div class="challenge-page" in:fade={{ duration: 800 }}>
    <!-- Spectacular Background Elements -->
    <div class="animated-bg"></div>
    <div class="particles">
        {#each { length: 20 } as _, i}
            <div class="particle" style="--i:{i}"></div>
        {/each}
    </div>
    <div class="cyber-grid"></div>

    <div class="glass-panel content-card has-corners">
        <!-- Cyber Corners -->
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>

        <h1>KAPPA GRID 27</h1>
        <h2 class="mission-title">MISSIE BRIEFING</h2>

        {#if showSuccess}
            <div class="success-message" transition:slide>
                <span class="success-icon">✅</span>
                <p>Locatie bevestigd! Voorbereiden op volgende missie...</p>
            </div>
        {:else}
            <div class="briefing-text">
                <p>
                    Agenten, goed dat jullie er zijn. De aliens hebben een
                    energieveld opgezet in de binnenstad van Maastricht.
                </p>
                <p>
                    Jullie doel: Vind de frequentie-sleutel om het veld te
                    neutraliseren.
                </p>
            </div>

            <button
                class="info-toggle-btn"
                onclick={() => (showExtraInfo = !showExtraInfo)}
                class:active={showExtraInfo}
            >
                ℹ️ Extra Informatie {showExtraInfo ? "▲" : "▼"}
            </button>

            {#if showExtraInfo}
                <div class="extra-info-panel" transition:slide>
                    <p>
                        👂 Luister goed naar <strong>koud</strong> of
                        <strong>warm</strong>.
                    </p>
                </div>
            {/if}

            <div class="mission-status">
                <div class="status-item">
                    <span class="label">Locatie:</span>
                    <span class="value">Zolder</span>
                </div>
                <div class="status-item">
                    <span class="label">Dreiging:</span>
                    <span class="value high">HOOG</span>
                </div>
            </div>

            <div class="code-entry">
                <label for="location-code">🔐 VOER LOCATIECODE IN:</label>
                <input
                    id="location-code"
                    type="text"
                    bind:value={locationCode}
                    placeholder="Type de code..."
                    onkeydown={(e) => e.key === "Enter" && handleCodeSubmit()}
                    autocomplete="off"
                    autocapitalize="none"
                />
                {#if errorMessage}
                    <p class="error-text" transition:slide>{errorMessage}</p>
                {/if}
                <button
                    class="action-button primary-action"
                    onclick={handleCodeSubmit}
                >
                    <span class="icon">🔓</span>
                    <span class="text">BEVESTIG CODE</span>
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Military / Tactical Theme */
    :global(body) {
        background-color: #0a0a0a;
        color: #e2e8f0;
    }

    .challenge-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
        background: #050505;
        font-family: "Courier New", Courier, monospace;
    }

    /* Scanlines Overlay */
    .challenge-page::before {
        content: "";
        position: absolute;
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
    }

    /* Targeting Reticle Background */
    .animated-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        background: radial-gradient(
                circle at center,
                transparent 30%,
                rgba(16, 185, 129, 0.03) 70%
            ),
            linear-gradient(rgba(16, 185, 129, 0.02) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(16, 185, 129, 0.02) 1px,
                transparent 1px
            );
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -1;
        animation: none;
    }

    .particles,
    .cyber-grid {
        display: none;
    }

    /* Tactical Card */
    .content-card {
        max-width: 600px;
        width: 100%;
        background: rgba(10, 20, 15, 0.95);
        border: 2px solid #10b981;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
        padding: 2.5rem;
        position: relative;
        clip-path: polygon(
            0 0,
            20px 0,
            20px 20px,
            calc(100% - 20px) 20px,
            calc(100% - 20px) 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            20px 100%,
            0 calc(100% - 20px)
        );
    }

    /* HUD Decorations */
    .has-corners::after {
        content: "STATUS: ACTIVE // ID: KG-27";
        position: absolute;
        bottom: 5px;
        right: 25px;
        font-family: "Orbitron", sans-serif;
        font-size: 0.6rem;
        color: #10b981;
        opacity: 0.7;
        letter-spacing: 1px;
    }

    .corner {
        display: none;
    }

    /* Typography */
    h1 {
        font-family: "Orbitron", sans-serif;
        color: #94a3b8;
        font-size: 1rem;
        letter-spacing: 6px;
        margin-bottom: 0.5rem;
        text-align: center;
        text-transform: uppercase;
    }

    .mission-title {
        font-family: "Orbitron", sans-serif;
        font-size: clamp(2rem, 5vw, 3rem);
        text-align: center;
        margin-bottom: 2.5rem;
        text-transform: uppercase;
        background: linear-gradient(135deg, white, #60a5fa);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(96, 165, 250, 0.4);
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .briefing-text {
        font-size: 1.15rem;
        line-height: 1.8;
        color: #e2e8f0;
        margin-bottom: 2.5rem;
        text-align: center;
        background: rgba(59, 130, 246, 0.1);
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 3px solid #60a5fa;
    }

    /* Code Entry */
    .code-entry {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .code-entry label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        color: #10b981;
        letter-spacing: 1px;
        text-align: center;
    }

    .code-entry input {
        width: 100%;
        padding: 1.2rem;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid #10b981;
        color: white;
        font-size: 1.3rem;
        font-family: "Orbitron", sans-serif;
        text-align: center;
        letter-spacing: 4px;
        text-transform: uppercase;
        border-radius: 8px;
    }

    .code-entry input:focus {
        outline: none;
        border-color: #34d399;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }

    .code-entry input::placeholder {
        color: #64748b;
        text-transform: none;
        letter-spacing: 0;
    }

    .error-text {
        color: #ef4444;
        font-size: 0.9rem;
        text-align: center;
        margin: 0;
    }

    /* Buttons */
    .primary-action {
        width: 100%;
        padding: 1.5rem;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .primary-action .text {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.3rem;
        letter-spacing: 2px;
    }

    .primary-action .icon {
        font-size: 1.5rem;
    }

    .primary-action:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
    }

    .primary-action::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transform: rotate(45deg) translate(-100%, -100%);
        transition: transform 0.6s;
    }

    .primary-action:hover::after {
        transform: rotate(45deg) translate(100%, 100%);
    }

    .info-toggle-btn {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(96, 165, 250, 0.3);
        color: #94a3b8;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.95rem;
        margin-bottom: 1rem;
        width: 100%;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .info-toggle-btn:hover,
    .info-toggle-btn.active {
        background: rgba(59, 130, 246, 0.2);
        border-color: #60a5fa;
        color: white;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
    }

    /* Status Panel */
    .mission-status {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
    }

    .status-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #94a3b8;
        letter-spacing: 1px;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.4rem;
        color: white;
    }

    .value.high {
        color: #ef4444;
        text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
        animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
        0%,
        100% {
            text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
        }
        50% {
            text-shadow: 0 0 25px rgba(239, 68, 68, 0.9);
        }
    }

    .extra-info-panel {
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid #3b82f6;
        padding: 1.2rem;
        margin-bottom: 2rem;
        border-radius: 0 8px 8px 0;
        text-align: center;
        animation: slideIn 0.3s ease-out;
    }

    .success-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 3rem;
        background: rgba(16, 185, 129, 0.1);
        border: 2px solid #10b981;
        border-radius: 16px;
    }

    .success-icon {
        font-size: 4rem;
    }

    .success-message p {
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        color: #10b981;
        text-align: center;
    }
</style>
