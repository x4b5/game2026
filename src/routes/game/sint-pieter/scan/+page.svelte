<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";

    let visible = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location (Vrijthof)
    const VALID_CODES = ["mooswief"];

    onMount(() => {
        visible = true;
    });

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";

            // Navigate to Theta Pulse after brief delay
            setTimeout(() => {
                goto("/game/theta-pulse-19");
            }, 1000);
        } else {
            errorMessage = "Onjuiste code. Kijk goed rond op het Vrijthof!";
            showSuccess = false;
        }
    }
</script>

<div class="scan-page" in:fade>
    <div class="content-panel glass-panel">
        <div class="status-header">
            <div class="pulse-dot"></div>
            <span>NIEUWE LOCATIE VEREIST</span>
        </div>

        <h1>ONDERWEG NAAR HET VRIJTHOF</h1>

        {#if showSuccess}
            <div class="success-message" transition:slide>
                <span class="success-icon">✅</span>
                <p>Locatie bevestigd! Voorbereiden op confrontatie...</p>
            </div>
        {:else}
            <div class="briefing">
                <p>
                    Viool beveiligd? Check. <br />
                    Nu is het tijd om de aliens te confronteren bij hun verzamelpunt.
                </p>

                <div class="location-hint">
                    📍 Zoek de locatiecode op het <strong>Vrijthof</strong>
                </div>

                <div class="code-entry">
                    <label for="location-code">🔐 VOER LOCATIECODE IN:</label>
                    <input
                        id="location-code"
                        type="text"
                        bind:value={locationCode}
                        placeholder="Type de code..."
                        onkeydown={(e) =>
                            e.key === "Enter" && handleCodeSubmit()}
                        autocomplete="off"
                        autocapitalize="none"
                    />
                    {#if errorMessage}
                        <p class="error-text" transition:slide>
                            {errorMessage}
                        </p>
                    {/if}
                    <button class="scan-btn" onclick={handleCodeSubmit}>
                        🔓 BEVESTIG LOCATIE
                    </button>
                </div>
            </div>
        {/if}

        <div class="footer-meta">
            <div class="line"></div>
            <span>Systeem status: Operationeel - Sonische wapens geladen</span>
        </div>
    </div>
</div>

<style>
    .scan-page {
        min-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
    }

    .content-panel {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2.5rem;
        background: rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(59, 130, 246, 0.4);
        box-shadow: 0 0 40px rgba(59, 130, 246, 0.15);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        border-radius: 16px;
    }

    .status-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.8rem;
        color: #60a5fa;
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        letter-spacing: 2px;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: #3b82f6;
        border-radius: 50%;
        box-shadow: 0 0 10px #3b82f6;
        animation: pulse 2s infinite;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2rem;
        color: white;
        letter-spacing: 2px;
        line-height: 1.2;
    }

    .briefing p {
        color: #cbd5e1;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .location-hint {
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
        padding: 1rem;
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 2rem;
        border: 1px dashed rgba(59, 130, 246, 0.4);
    }

    .code-entry {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }

    .code-entry label {
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        color: #60a5fa;
        letter-spacing: 1px;
    }

    .code-entry input {
        width: 100%;
        padding: 1.2rem;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid #3b82f6;
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
        border-color: #60a5fa;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
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

    .scan-btn {
        width: 100%;
        padding: 1.2rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .scan-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
    }

    .success-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 3rem;
        background: rgba(59, 130, 246, 0.1);
        border: 2px solid #3b82f6;
        border-radius: 16px;
    }

    .success-icon {
        font-size: 4rem;
    }

    .success-message p {
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        color: #60a5fa;
        text-align: center;
    }

    .footer-meta {
        margin-top: auto;
    }

    .line {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin-bottom: 0.8rem;
    }

    .footer-meta span {
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        color: #64748b;
        letter-spacing: 1px;
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.6;
        }
    }
</style>
