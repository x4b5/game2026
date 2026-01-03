<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";

    let visible = $state(false);
    let showHint = $state(false);
    let intelScanned = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location
    const VALID_CODES = ["badkamer"];

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";

            // Navigate to Zeta Flux after brief delay
            setTimeout(() => {
                const nextPath = "/game/zeta-flux-33";
                fetch("/api/mission", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ navTo: nextPath }),
                }).catch(console.error);
                goto(nextPath);
            }, 1000);
        } else {
            errorMessage = "Onjuiste code. Los de puzzel op!";
            showSuccess = false;
        }
    }

    onMount(() => {
        visible = true;
        setTimeout(() => (intelScanned = true), 1500);
    });
</script>

<div class="victory-page" in:fade={{ duration: 1000 }}>
    <div class="content-card glass-panel">
        <div class="header-section">
            <div class="success-badge">DECRYPTIE VOLTOOID</div>
            <h1>INKOMEND INTEL RAPPORT</h1>
        </div>

        <div class="intel-grid">
            <div class="intel-block" in:fly={{ x: -20, delay: 500 }}>
                <span class="label">STATUS</span>
                <span class="value success">WAPENS VERBRAND</span>
            </div>
            <div class="intel-block" in:fly={{ x: 20, delay: 700 }}>
                <span class="label">SITUATIE</span>
                <span class="value highlight">VIJAND VERZWAKT</span>
            </div>
        </div>

        <div class="report-content">
            {#if intelScanned}
                <div class="report-text" in:fade>
                    <p>
                        <strong>SITUATIE:</strong> De wapens zijn vernietigd. De
                        vijand trekt zich terug. We ontvangen edoch een vreemd signaal.
                    </p>
                    <p class="warning">
                        📡 <strong>ORDER:</strong> Onderzoek de bron van dit
                        signaal. Verplaats naar sector
                        <strong>ZETA FLUX</strong>.
                    </p>
                </div>
            {:else}
                <div class="scanning-loader">
                    <div class="scan-bar"></div>
                    DATA DECRYPTEN...
                </div>
            {/if}
        </div>

        <div class="action-section">
            {#if showSuccess}
                <div class="success-message" transition:slide>
                    <span class="success-icon">✅</span>
                    <p>Locatie bevestigd! Naar Zeta Flux...</p>
                </div>
            {:else}
                <button
                    class="hint-toggle"
                    onclick={() => (showHint = !showHint)}
                >
                    {showHint ? "❌ SLUIT COÖRDINATEN" : "🔍 TOON LOCATIE DATA"}
                </button>

                {#if showHint}
                    <div class="hint-box" transition:slide>
                        <p>
                            📍 <strong>LOCATIE PUZZEL:</strong> Waar is Zeta Flux?
                            Los op:
                        </p>
                        <div class="riddle-math">((14 × 3) + 6) ÷ 6 = ?</div>
                        <p class="riddle-instruction">
                            De uitkomst is het <strong>aantal letters</strong> van
                            de ruimte waar je moet zoeken.
                        </p>
                    </div>
                {/if}

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
                    <button class="next-btn" onclick={handleCodeSubmit}>
                        🔓 BEVESTIG LOCATIE
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .victory-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 2.5rem;
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid #22c55e;
        box-shadow: 0 0 50px rgba(34, 197, 94, 0.2);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        border-radius: 16px;
    }

    .header-section {
        text-align: center;
        margin-bottom: 0.5rem;
    }

    .success-badge {
        display: inline-block;
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
        padding: 0.4rem 1.2rem;
        border-radius: 4px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.75rem;
        border: 1px solid #22c55e;
        margin-bottom: 1rem;
        letter-spacing: 1px;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 1.8rem;
        color: white;
        letter-spacing: 1px;
        margin: 0;
    }

    .intel-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .intel-block {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 3px solid #22c55e;
    }

    .intel-block .label {
        display: block;
        font-size: 0.7rem;
        color: #94a3b8;
        margin-bottom: 0.3rem;
        text-transform: uppercase;
    }

    .intel-block .value {
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
    }

    .value.success {
        color: #4ade80;
    }
    .value.highlight {
        color: #3b82f6;
    }

    .report-content {
        background: rgba(0, 0, 0, 0.3);
        padding: 1.5rem;
        border-radius: 12px;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .report-text {
        color: #cbd5e1;
        font-size: 0.95rem;
        line-height: 1.6;
        text-align: left;
    }

    .report-text p {
        margin-bottom: 1rem;
    }

    .warning {
        color: #fbbf24;
        background: rgba(251, 191, 36, 0.1);
        padding: 0.8rem;
        border-radius: 6px;
        font-size: 0.85rem;
    }

    .scanning-loader {
        font-family: "Orbitron", sans-serif;
        color: #22c55e;
        letter-spacing: 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .scan-bar {
        width: 150px;
        height: 2px;
        background: rgba(34, 197, 94, 0.3);
        position: relative;
        overflow: hidden;
    }

    .scan-bar::after {
        content: "";
        position: absolute;
        width: 40px;
        height: 100%;
        background: #22c55e;
        box-shadow: 0 0 10px #22c55e;
        animation: scan 1.5s linear infinite;
    }

    @keyframes scan {
        from {
            left: -40px;
        }
        to {
            left: 150px;
        }
    }

    .action-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .hint-toggle {
        background: rgba(255, 255, 255, 0.1);
        color: #94a3b8;
        border: 1px dashed rgba(255, 255, 255, 0.3);
        padding: 0.6rem;
        border-radius: 6px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        transition: all 0.2s;
    }

    .hint-toggle:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
    }

    .hint-box {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid #3b82f6;
        padding: 1.5rem;
        border-radius: 8px;
        color: #dbeafe;
        font-size: 0.95rem;
        text-align: center;
    }

    .riddle-math {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        color: #fbbf24;
        margin: 1.5rem 0;
        letter-spacing: 2px;
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 6px;
        border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .riddle-instruction {
        font-style: italic;
        color: #94a3b8;
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
        color: #22c55e;
        letter-spacing: 1px;
        text-align: center;
    }

    .code-entry input {
        width: 100%;
        padding: 1.2rem;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid #22c55e;
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
        border-color: #4ade80;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
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

    .next-btn {
        width: 100%;
        padding: 1rem;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .next-btn:hover {
        background: #16a34a;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
    }

    .success-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        background: rgba(34, 197, 94, 0.1);
        border: 2px solid #22c55e;
        border-radius: 16px;
    }

    .success-icon {
        font-size: 3rem;
    }

    .success-message p {
        font-family: "Orbitron", sans-serif;
        font-size: 1.1rem;
        color: #22c55e;
        text-align: center;
    }
</style>
