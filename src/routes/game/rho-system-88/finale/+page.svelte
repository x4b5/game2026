<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
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
        if (decodedText.startsWith("http")) {
            try {
                const url = new URL(decodedText);
                if (url.pathname.startsWith("/game")) {
                    goto(url.pathname);
                } else {
                    window.location.href = decodedText;
                }
            } catch (e) {
                window.location.href = decodedText;
            }
        } else {
            goto(`/game/${decodedText}`);
        }
    }

    function onScanFailure(error: any) {
        // handle scan failure
    }

    function startScanner() {
        isScanning = true;
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

<div class="finale-page" in:fade={{ duration: 1000 }}>
    <div class="content-card glass-panel">
        <div class="signal-indicator">
            <div class="dot"></div>
            <span>INKOMEND SIGNAAL...</span>
        </div>

        <h1>NIEUWE INSTRUCTIES</h1>

        {#if isScanning}
            <div class="scanner-wrapper" transition:slide>
                <div id="reader"></div>
                <button class="cancel-scan-btn" onclick={stopScanner}>
                    ❌ Stop Scannen
                </button>
            </div>
        {:else}
            <div class="message-container">
                <p in:fly={{ y: 20, duration: 800, delay: 500 }}>
                    Agenten, dit was nog maar het begin. De neutralisatie van
                    Rho System heeft een kettingreactie veroorzaakt.
                </p>
                <p in:fly={{ y: 20, duration: 800, delay: 1500 }}>
                    We ontvangen coördinaten van Alien-activiteit in de
                    Kazematten.
                </p>
                <p in:fly={{ y: 20, duration: 800, delay: 2500 }}>
                    Ga zo snel mogelijk naar de locatie om te onderzoeken wat er
                    aan de hand is. Wees op uw hoede!
                </p>

                <button
                    class="extra-info-btn"
                    onclick={() => (showExtraInfo = !showExtraInfo)}
                    class:active={showExtraInfo}
                >
                    ℹ️ Extra Informatie {showExtraInfo ? "▲" : "▼"}
                </button>

                {#if showExtraInfo}
                    <div class="extra-info-panel" transition:slide>
                        <p>
                            ❄️ Ga naar de <strong>koudste plek</strong> van de
                            <strong>laagste ruimte</strong> en scan de code.
                        </p>
                    </div>
                {/if}

                <p in:fly={{ y: 20, duration: 800, delay: 3500 }}>
                    <strong>Tijd:</strong> T-minus 10 minuten
                </p>
            </div>

            <button class="action-button" onclick={startScanner}>
                📷 SCAN OMGEVING
            </button>
        {/if}

        <div class="loading-bar">
            <div class="progress"></div>
        </div>

        <p class="status-text">Decorcyclering...</p>
    </div>
</div>

<style>
    .finale-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
        text-align: center;
    }

    .signal-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #ef4444;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        margin-bottom: 2rem;
        animation: blink 2s infinite;
    }

    .dot {
        width: 10px;
        height: 10px;
        background: #ef4444;
        border-radius: 50%;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        color: white;
        font-size: 2rem;
        margin-bottom: 2rem;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .message-container {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #cbd5e1;
        margin-bottom: 3rem;
        min-height: 150px;
        text-align: center;
    }

    .message-container p {
        margin-bottom: 1.5rem;
    }

    .extra-info-btn {
        background: none;
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: rgba(255, 255, 255, 0.7);
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
        width: 100%;
        transition: all 0.3s ease;
    }

    .extra-info-btn:hover {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.6);
        color: white;
    }

    .extra-info-btn.active {
        background: rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
        color: #60a5fa;
    }

    .extra-info-panel {
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid #3b82f6;
        padding: 1rem;
        margin-bottom: 2rem;
        border-radius: 0 8px 8px 0;
        text-align: center;
    }

    .extra-info-panel p {
        margin: 0 !important;
        color: white;
        font-size: 1rem;
    }

    strong {
        color: white;
    }

    .loading-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .progress {
        width: 100%;
        height: 100%;
        background: var(--primary);
        transform-origin: left;
        animation: load 5s linear infinite;
    }

    .status-text {
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        color: var(--text-muted);
        letter-spacing: 1px;
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
        margin-bottom: 2rem;
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
        margin-bottom: 2rem;
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

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    @keyframes load {
        0% {
            transform: scaleX(0);
        }
        50% {
            transform: scaleX(0.5);
        }
        100% {
            transform: scaleX(1);
        }
    }
</style>
