<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";

    let visible = $state(false);
    let showHint = $state(false);
    let intelScanned = $state(false);

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
                <span class="value success">VIJAND GESTOPT</span>
            </div>
            <div class="intel-block" in:fly={{ x: 20, delay: 700 }}>
                <span class="label">LOCATIE GEVONDEN</span>
                <span class="value highlight">OMICRON BASE</span>
            </div>
        </div>

        <div class="report-content">
            {#if intelScanned}
                <div class="report-text" in:fade>
                    <p>
                        <strong>SITUATIE:</strong> De decryptie heeft een
                        bizarre zwakte blootgelegd. Het blijkt dat de aliens de
                        viool van <strong>André Rieu</strong> hebben gestolen en
                        verborgen.
                    </p>
                    <p>
                        <strong>DECRYPTIE:</strong> Uit onderschepte bio-data
                        blijkt dat de aliens fysiek onwel worden van zijn
                        muziek. Het horen van de vioolklanken veroorzaakt acute
                        <strong>diarree</strong> bij de aanvallers.
                    </p>
                    <p class="warning">
                        🎻 <strong>NIEUWE MISSIE:</strong> Vind de viool en gebruik
                        de muziek als biologisch wapen om de invasie te stoppen.
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
            <button class="hint-toggle" onclick={() => (showHint = !showHint)}>
                {showHint ? "❌ SLUIT COÖRDINATEN" : "🔍 TOON LOCATIE DATA"}
            </button>

            {#if showHint}
                <div class="hint-box" transition:slide>
                    <p>
                        📍 <strong>SINT PIETER:</strong> "Vind de viool in Sint Pieter.
                        Maar eerst... los deze versleutelde som op:"
                    </p>
                    <div class="riddle-math">((14 × 3) + 6) ÷ 6 = ?</div>
                    <p class="riddle-instruction">
                        Het cijfer is het <strong>aantal letters</strong> van het
                        woord van deze woonruimte.
                    </p>
                </div>
            {/if}

            <button class="next-btn" onclick={() => goto("/game")}>
                TERUG NAAR DASHBOARD
            </button>
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
        min-height: 180px;
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

    .next-btn {
        width: 100%;
        padding: 1rem;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
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
</style>
