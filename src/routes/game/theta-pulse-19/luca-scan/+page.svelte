<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";

    let visible = $state(false);
    let locationCode = $state("");
    let errorMessage = $state("");
    let showSuccess = $state(false);

    // Valid passwords for this location (Luca's room / Wyck)
    const VALID_CODES = ["luca", "wyck", "slaapkamer", "geheim", "brug"];

    onMount(() => {
        visible = true;
    });

    function handleCodeSubmit() {
        const code = locationCode.toLowerCase().trim();

        if (VALID_CODES.includes(code)) {
            showSuccess = true;
            errorMessage = "";

            // Navigate to Mosa Bridge after brief delay
            setTimeout(() => {
                goto("/game/mosa-bridge-44");
            }, 1000);
        } else {
            errorMessage = "Onjuiste code. Zoek in de buurt van de brug!";
            showSuccess = false;
        }
    }
</script>

<div class="scan-page" in:fade>
    <div class="content-panel glass-panel">
        <div class="status-header">
            <div class="pulse-dot"></div>
            <span>TARGET GELOKALISEERD</span>
        </div>

        <h1>MISSIE: WYCK</h1>

        {#if showSuccess}
            <div class="success-message" transition:slide>
                <span class="success-icon">✅</span>
                <p>Coördinaten ontvangen! Aliens gedetecteerd bij de brug...</p>
            </div>
        {:else}
            <div class="new-mission-briefing" in:fly={{ y: 20 }}>
                <div class="mission-header">
                    <span class="pulse-tag">NIEUWE OPDRACHT: ACHTERVOLGING</span
                    >
                </div>
                <p>
                    De aliens zijn ontsnapt! We moeten ze onmiddellijk
                    terugvinden. Voer de locatiecode in om de coördinaten van de
                    ontsnapte aliens te achterhalen.
                </p>
                <div class="objective-list">
                    <div class="objective-item">
                        <span class="icon">🏃‍♂️</span>
                        <span>Achtervolg de aliens naar de brug in Wyck.</span>
                    </div>
                    <div class="objective-item">
                        <span class="icon">🌉</span>
                        <span>Vind de locatiecode bij de brug.</span>
                    </div>
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
                    <button class="scan-btn pulse" onclick={handleCodeSubmit}>
                        🔓 BEVESTIG & ONDERSCHEP
                    </button>
                </div>
            </div>
        {/if}

        <div class="footer-meta">
            <div class="line"></div>
            <span>Detectie-radius: 2.5 meter - Infrarood actief</span>
        </div>
    </div>
</div>

<style>
    .scan-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 1rem;
        overflow-y: auto;
    }

    .content-panel {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2.5rem;
        background: rgba(15, 23, 42, 0.95);
        border: 2px solid #3b82f6;
        box-shadow: 0 0 50px rgba(59, 130, 246, 0.2);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        border-radius: 24px;
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
        font-size: 2.2rem;
        color: white;
        letter-spacing: 3px;
        line-height: 1.2;
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }

    .new-mission-briefing {
        padding: 1.5rem;
        background: rgba(59, 130, 246, 0.05);
        border-radius: 16px;
        border: 1px solid rgba(59, 130, 246, 0.2);
        text-align: left;
    }

    .mission-header {
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .pulse-tag {
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        color: #60a5fa;
        background: rgba(59, 130, 246, 0.1);
        padding: 0.4rem 1rem;
        border-radius: 4px;
        border: 1px solid rgba(59, 130, 246, 0.3);
        letter-spacing: 1px;
    }

    .new-mission-briefing p {
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
    }

    .objective-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .objective-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.8rem;
        border-radius: 8px;
        font-size: 0.95rem;
    }

    .objective-item .icon {
        font-size: 1.2rem;
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
        text-align: center;
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
        padding: 1.4rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
    }

    .scan-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
        filter: brightness(1.1);
    }

    .scan-btn.pulse {
        animation: subtlePulse 2s infinite;
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

    @keyframes subtlePulse {
        0%,
        100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }
        50% {
            transform: scale(1.02);
            box-shadow: 0 0 35px rgba(59, 130, 246, 0.4);
        }
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

    @media (max-width: 600px) {
        .content-panel {
            padding: 2rem 1.5rem;
            gap: 1.5rem;
        }

        h1 {
            font-size: 1.8rem;
        }

        .scan-btn {
            padding: 1.1rem;
            font-size: 1.1rem;
        }
    }
</style>
