<script lang="ts">
    import { goto } from "$app/navigation";
    import { gameProgress } from "$lib/stores/gameStore";
    import { onMount } from "svelte";

    let qrInput = $state("");
    let isChecking = $state(true);

    onMount(() => {
        // Check if player has joined
        const stored = localStorage.getItem("game2026_progress");
        let hasPlayer = false;

        if (stored) {
            const data = JSON.parse(stored);
            if (data.player && data.player.name) {
                hasPlayer = true;
            }
        }

        if (!hasPlayer) {
            // No player data -> Redirect to welcome/setup page
            goto("/game/kappa-grid-27");
        } else {
            isChecking = false;
        }
    });

    function handleDirectJoin() {
        if (qrInput.trim()) {
            goto(`/game/${qrInput}`);
        }
    }
</script>

{#if !isChecking}
    <div class="dashboard-container">
        <div class="glass-panel dashboard-card animate-fade-in">
            <h1>MISSIE COMMANDO</h1>
            <p>
                Welkom, agent. Scan een QR-code om je volgende missie te
                starten.
            </p>

            <div class="scan-section">
                <div class="pulse-ring"></div>
                <div class="scanner-icon">📷</div>
            </div>

            <div class="input-group">
                <input
                    type="text"
                    bind:value={qrInput}
                    placeholder="Of voer code in..."
                    onkeydown={(e) => e.key === "Enter" && handleDirectJoin()}
                />
                <button
                    class="btn-primary"
                    onclick={handleDirectJoin}
                    disabled={!qrInput}
                >
                    Start Missie
                </button>
            </div>
        </div>
    </div>
{:else}
    <div class="loading">Systeem initialiseren...</div>
{/if}

<style>
    .dashboard-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        min-height: 80vh;
    }

    .dashboard-card {
        max-width: 500px;
        width: 100%;
        padding: 2rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        color: white;
        margin-bottom: 1rem;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
    }

    p {
        color: #ccc;
        margin-bottom: 2rem;
    }

    .scan-section {
        margin: 2rem auto;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .scanner-icon {
        font-size: 3rem;
    }

    .pulse-ring {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        border: 2px solid var(--primary);
        animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        width: 100%;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
        font-size: 1.1rem;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .loading {
        color: white;
        text-align: center;
        margin-top: 5rem;
        font-family: "Orbitron", sans-serif;
    }
</style>
