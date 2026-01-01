<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });

    function nextMission() {
        goto("/game/rho-system-88/finale");
    }
</script>

<div class="success-page" in:fade={{ duration: 1000 }}>
    <div class="glass-panel content-card">
        <div
            class="icon-container"
            in:scale={{ duration: 800, delay: 300, start: 0.5 }}
        >
            <div class="pulse-ring"></div>
            <span class="icon">🛡️</span>
            <span class="check-badge">✓</span>
        </div>

        <h1 class="glitch-text" data-text="MISSIE GESLAAGD">MISSIE GESLAAGD</h1>
        <h2 class="subtitle">ENERGIEVELD GENEUTRALISEERD</h2>

        <div class="status-line"></div>

        <p class="description">
            Goed werk, agenten. De binnenstad is weer veilig... voor nu. De
            frequentie-sleutel is geaccepteerd en het krachtveld is
            gedeactiveerd.
        </p>

        <div class="metrics">
            <div class="metric">
                <span class="label">Status</span>
                <span class="value safe">VEILIG</span>
            </div>
            <div class="metric">
                <span class="label">Integriteit</span>
                <span class="value">100%</span>
            </div>
        </div>

        <button class="next-btn" onclick={nextMission}> Ga Verder </button>
    </div>
</div>

<style>
    .success-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        --success-color: #22c55e;
        --success-glow: rgba(34, 197, 94, 0.5);
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(0, 20, 0, 0.6);
        border: 1px solid rgba(34, 197, 94, 0.3);
        box-shadow: 0 0 50px rgba(34, 197, 94, 0.2);
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .icon-container {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon {
        font-size: 5rem;
        filter: drop-shadow(0 0 20px var(--success-glow));
    }

    .check-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        background: var(--success-color);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 1.5rem;
        border: 4px solid rgba(0, 0, 0, 0.8);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    .pulse-ring {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        border: 3px solid var(--success-color);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        color: var(--success-color);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        font-weight: 900;
        text-shadow: 0 0 20px var(--success-glow);
    }

    .subtitle {
        font-family: "Orbitron", sans-serif;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        letter-spacing: 2px;
        margin-bottom: 2rem;
    }

    .status-line {
        height: 2px;
        background: linear-gradient(
            90deg,
            transparent,
            var(--success-color),
            transparent
        );
        margin-bottom: 2rem;
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    }

    .description {
        color: #e2e8f0;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2.5rem;
    }

    .metrics {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin-bottom: 3rem;
        background: rgba(34, 197, 94, 0.1);
        padding: 1rem;
        border-radius: 12px;
    }

    .metric {
        display: flex;
        flex-direction: column;
    }

    .label {
        font-size: 0.8rem;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0.2rem;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
    }

    .value.safe {
        color: var(--success-color);
    }

    .next-btn {
        background: var(--success-color);
        color: rgba(0, 30, 0, 0.9);
        border: none;
        padding: 1rem 2rem;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
    }

    .next-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px var(--success-glow);
        background: #4ade80;
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 1.8rem;
        }
        .icon-container {
            width: 100px;
            height: 100px;
        }
        .content-card {
            padding: 2rem 1.5rem;
        }
    }
</style>
