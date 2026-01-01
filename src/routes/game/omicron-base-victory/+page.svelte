<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";

    let visible = $state(false);
    let showHint = $state(false);
    let intelScanned = $state(false);
    let isScanning = $state(false);
    let scanner: any = null;
    let adminPassword = $state("");

    function handleAdminBypass() {
        if (adminPassword.toLowerCase() === "xavier") {
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
            }
        }
    }

    async function handleNext() {
        isScanning = true;
        setTimeout(() => {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false,
            );
            scanner.render(onScanSuccess, () => {});
        }, 100);
    }

    async function onScanSuccess(decodedText: string) {
        const code = decodedText.toLowerCase().trim();
        const nextPath = "/game/zeta-flux-33";

        if (scanner) {
            await scanner.clear();
            isScanning = false;
            scanner = null;
        }

        // Tell everyone else to follow
        await fetch("/api/mission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navTo: nextPath }),
        }).catch(console.error);

        goto(nextPath);
    }

    function stopScanner() {
        if (scanner) {
            scanner
                .clear()
                .then(() => {
                    isScanning = false;
                    scanner = null;
                })
                .catch(console.error);
        } else {
            isScanning = false;
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
                        <strong>ZETA FLUX</strong> (Locatie: De Bovenkamer).
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
            {#if isScanning}
                <div class="scanner-wrapper" transition:slide>
                    <div class="scanner-briefing">
                        <h3>BEVESTIG LOCATIE</h3>
                        <p>
                            Scan de QR-code op de bestemming om de
                            kluis-interface te activeren.
                        </p>
                    </div>
                    <div id="reader"></div>
                    <button class="cancel-scan-btn" onclick={stopScanner}>
                        ❌ ANNULEER SCAN
                    </button>
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

                <button class="next-btn" onclick={handleNext}>
                    📷 BEVESTIG LOCATIE
                </button>

                <!-- Admin Password Field -->
                <div class="admin-bypass">
                    <input
                        type="password"
                        bind:value={adminPassword}
                        placeholder="Admin wachtwoord..."
                        onkeydown={(e) =>
                            e.key === "Enter" && handleAdminBypass()}
                    />
                    <button onclick={handleAdminBypass}>Doorgaan</button>
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

    /* Scanner Styles */
    .scanner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }

    #reader {
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #22c55e;
        background: black;
    }

    .scanner-briefing h3 {
        font-family: "Orbitron", sans-serif;
        color: #4ade80;
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    .scanner-briefing p {
        color: #94a3b8;
        font-size: 0.85rem;
        line-height: 1.4;
    }

    .cancel-scan-btn {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid #ef4444;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
    }

    .cancel-scan-btn:hover {
        background: #ef4444;
        color: white;
    }

    .admin-bypass {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border: 1px dashed rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        display: flex;
        gap: 0.5rem;
    }

    .admin-bypass input {
        flex: 1;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.8rem;
        border-radius: 6px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
    }

    .admin-bypass input:focus {
        outline: none;
        border-color: #22c55e;
    }

    .admin-bypass button {
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid #22c55e;
        color: #4ade80;
        padding: 0.8rem 1.2rem;
        border-radius: 6px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
    }

    .admin-bypass button:hover {
        background: rgba(34, 197, 94, 0.3);
        transform: translateY(-1px);
    }
</style>
