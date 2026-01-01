<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";

    let visible = $state(false);
    let showExtraInfo = $state(false);
    let isScanning = $state(false);
    let scanner: any = null;

    onMount(() => {
        visible = true;
    });

    onDestroy(() => {
        if (scanner) {
            scanner.clear().catch(console.error);
        }
    });

    function onScanSuccess(decodedText: string, decodedResult: any) {
        console.log(`Code scanned = ${decodedText}`, decodedResult);

        // Stop scanning
        if (scanner) {
            scanner
                .clear()
                .then(() => {
                    isScanning = false;
                    scanner = null;
                })
                .catch(console.error);
        }

        // Handle navigation
        // Expecting URL or game code. For now, basic handling:
        if (decodedText.startsWith("http")) {
            // If it's a URL within our app, navigate
            try {
                const url = new URL(decodedText);
                if (url.pathname.startsWith("/game")) {
                    goto(url.pathname);
                } else {
                    window.location.href = decodedText;
                }
            } catch (e) {
                // Fallback
                window.location.href = decodedText;
            }
        } else {
            // Assume it's a game code like "DELTA-11"
            goto(`/game/${decodedText}`);
        }
    }

    function onScanFailure(error: any) {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    }

    function startScanner() {
        isScanning = true;
        // Wait for DOM to update
        setTimeout(() => {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false,
            );
            scanner.render(onScanSuccess, onScanFailure);
        }, 100);
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
</script>

<div class="challenge-page" in:fade={{ duration: 800 }}>
    <div class="glass-panel content-card">
        <h1>KAPPA GRID 27</h1>
        <h2>MISSIE BRIEFING</h2>

        <!-- Scanner Container -->
        {#if isScanning}
            <div class="scanner-wrapper" transition:slide>
                <div id="reader"></div>
                <button class="cancel-scan-btn" onclick={stopScanner}>
                    ❌ Stop Scannen
                </button>
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

            <button class="action-button" onclick={startScanner}>
                📷 SCAN OMGEVING
            </button>
        {/if}
    </div>
</div>

<style>
    .challenge-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 2.5rem;
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        color: rgba(255, 255, 255, 0.5);
        font-size: 1rem;
        letter-spacing: 4px;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    h2 {
        font-family: "Orbitron", sans-serif;
        color: white;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 2rem;
        text-transform: uppercase;
        text-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
    }

    .briefing-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #e2e8f0;
        margin-bottom: 2rem;
        text-align: center;
    }

    .mission-status {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        position: relative;
    }

    .info-toggle-btn {
        background: none;
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: rgba(255, 255, 255, 0.8);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        width: 100%;
        transition: all 0.3s ease;
    }

    .info-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.6);
        color: white;
    }

    .info-toggle-btn.active {
        background: rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
        color: #60a5fa;
    }

    .extra-info-panel {
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid #3b82f6;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border-radius: 0 8px 8px 0;
        text-align: center;
    }

    .extra-info-panel p {
        margin: 0;
        color: white;
        font-size: 1rem;
    }

    .status-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .label {
        font-size: 0.8rem;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0.3rem;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
    }

    .value.high {
        color: #ef4444;
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
    }

    .action-button {
        width: 100%;
        padding: 1.5rem;
        background: var(--primary);
        color: white;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
        letter-spacing: 2px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
    }

    /* Scanner Styles */
    .scanner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    #reader {
        width: 100%;
        min-height: 250px;
        background: black;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid var(--primary);
    }

    .cancel-scan-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cancel-scan-btn:hover {
        background: #dc2626;
        transform: scale(1.05);
    }
</style>
