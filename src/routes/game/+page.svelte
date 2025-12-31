<script lang="ts">
    import { goto } from "$app/navigation";

    let qrInput = $state("");

    function handleDirectJoin() {
        if (qrInput.trim()) {
            goto(`/game/${qrInput}`);
        }
    }
</script>

<div class="join-container">
    <div class="glass-panel join-card animate-fade-in">
        <h1>Handmatige Toegang</h1>
        <p>
            Heb je geen QR-code? Voer hier de sessiecode in om deel te nemen aan
            het spel.
        </p>

        <div class="input-group">
            <input
                type="text"
                bind:value={qrInput}
                placeholder="Bijv: ALPHA-2026"
                onkeydown={(e) => e.key === "Enter" && handleDirectJoin()}
            />
            <button
                class="btn-primary"
                onclick={handleDirectJoin}
                disabled={!qrInput}
            >
                Deelnemen
            </button>
        </div>

        <div class="help-text">
            <p>
                Tip: Zoek naar de QR-codes op de speellocatie voor de beste
                ervaring.
            </p>
        </div>
    </div>
</div>

<style>
    .join-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
    }

    .join-card {
        max-width: 450px;
        width: 100%;
        padding: 3rem 2.5rem;
        text-align: center;
    }

    h1 {
        margin-bottom: 1rem;
        font-size: 1.75rem;
    }

    p {
        color: var(--text-muted);
        margin-bottom: 2rem;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        width: 100%;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--glass-border);
        color: white;
        font-size: 1.1rem;
        text-align: center;
        font-family: inherit;
        transition: border-color 0.3s ease;
    }

    input:focus {
        outline: none;
        border-color: var(--primary);
    }

    .btn-primary {
        padding: 1rem;
        border-radius: 12px;
        background: var(--primary);
        color: white;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--primary-hover);
        transform: translateY(-2px);
    }

    .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .help-text {
        margin-top: 2rem;
        font-size: 0.875rem;
        font-style: italic;
    }
</style>
