<script lang="ts">
    import { page } from "$app/state";
    import { onMount } from "svelte";

    const id = $derived(page.params.id);
    let loading = $state(true);

    onMount(() => {
        // Simuleer laden van game data gebaseerd op ID van de QR code
        setTimeout(() => {
            loading = false;
        }, 1500);
    });
</script>

<div class="game-container">
    {#if loading}
        <div class="loading-state animate-fade-in">
            <div class="spinner"></div>
            <h2>Game laden...</h2>
            <p>Sessie: {id}</p>
        </div>
    {:else}
        <div class="game-content animate-fade-in">
            <div class="glass-panel main-interface">
                <header>
                    <span class="status">Live • Sessie {id}</span>
                    <h1>Missie Gestart</h1>
                </header>

                <div class="message-box">
                    <p>
                        Je bent succesvol ingelogd via de QR-code. Jouw avontuur
                        voor 2026 begint hier.
                    </p>
                </div>

                <div class="action-grid">
                    <button class="game-card">
                        <span class="icon">🧭</span>
                        <span>Verkennen</span>
                    </button>
                    <button class="game-card">
                        <span class="icon">🧩</span>
                        <span>Puzzel</span>
                    </button>
                    <button class="game-card">
                        <span class="icon">🏆</span>
                        <span>Score</span>
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .game-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
    }

    .loading-state {
        text-align: center;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--glass-border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .main-interface {
        max-width: 500px;
        width: 100%;
        padding: 2.5rem;
    }

    header {
        margin-bottom: 2rem;
    }

    .status {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--secondary);
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
    }

    h1 {
        font-size: 2rem;
    }

    .message-box {
        background: rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    .message-box p {
        color: var(--text-main);
        font-size: 1rem;
    }

    .action-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .game-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem 0.5rem;
        border-radius: 16px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        transition: all 0.2s ease;
        color: white;
    }

    .game-card:hover {
        background: var(--primary);
        transform: translateY(-4px);
    }

    .game-card .icon {
        font-size: 1.5rem;
    }

    .game-card span:not(.icon) {
        font-size: 0.75rem;
        font-weight: 600;
    }
</style>
