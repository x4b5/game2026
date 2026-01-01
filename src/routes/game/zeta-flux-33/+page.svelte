<script lang="ts">
    import MissionPage from "$lib/components/MissionPage.svelte";
    import { onMount, onDestroy } from "svelte";
    import { fade, slide, fly } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";

    let isScanning = $state(false);
    let scanner: any = null;

    onDestroy(() => {
        if (scanner) {
            scanner.clear().catch(console.error);
        }
    });

    function onScanSuccess(decodedText: string) {
        if (scanner) {
            scanner
                .clear()
                .then(() => {
                    isScanning = false;
                    scanner = null;
                })
                .catch(console.error);
        }

        const code = decodedText.toLowerCase();
        if (
            code === "zeta-flux-circuit" ||
            code === "circuit" ||
            code === "zeta-flux-33/circuit-overload"
        ) {
            goto("/game/zeta-flux-33/circuit-overload");
            return;
        }

        if (
            code === "safe" ||
            code === "kluis" ||
            code === "sint-pieter-safe"
        ) {
            goto("/game/sint-pieter/safe");
            return;
        }

        if (decodedText.startsWith("http")) {
            try {
                const url = new URL(decodedText);
                goto(
                    url.pathname.startsWith("/game")
                        ? url.pathname
                        : decodedText,
                );
            } catch (e) {
                window.location.href = decodedText;
            }
        } else {
            goto(`/game/${decodedText}`);
        }
    }

    function startScanner() {
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

<div class="zeta-page" in:fade={{ duration: 1000 }}>
    <div class="content-card glass-panel">
        <div class="status-indicator">
            <div class="pulse-dot"></div>
            <span>LOCATIE BEREIKT: ZETA FLUX</span>
        </div>

        {#if isScanning}
            <div class="scanner-wrapper" transition:slide>
                <div id="reader"></div>
                <button class="cancel-scan-btn" onclick={stopScanner}>
                    ❌ Stop Scannen
                </button>
            </div>
        {:else}
            <div class="briefing-section">
                <button class="action-button" onclick={startScanner}>
                    📷 SCAN QR-SLEUTEL
                </button>
            </div>
        {/if}

        <div class="footer-status">
            <div class="loading-line"></div>
            <span>Status: Wachten op decryptie...</span>
        </div>
    </div>
</div>
```

<style>
    .zeta-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 3rem 2rem;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(139, 92, 246, 0.4);
        box-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .status-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        color: #a78bfa;
        font-family: "Orbitron", sans-serif;
        font-size: 0.8rem;
        letter-spacing: 2px;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: #8b5cf6;
        border-radius: 50%;
        box-shadow: 0 0 10px #8b5cf6;
        animation: pulse 2s infinite;
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2.2rem;
        color: white;
        margin-bottom: 1rem;
        letter-spacing: 2px;
        text-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    }

    .briefing-section p {
        color: #cbd5e1;
        font-size: 1.05rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .warning-box {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        padding: 1rem;
        border-radius: 8px;
        color: #d8b4fe;
        font-size: 0.9rem;
        margin-bottom: 2.5rem;
    }

    .action-button {
        width: 100%;
        padding: 1.2rem;
        background: #8b5cf6;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.1rem;
        letter-spacing: 1px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
    }

    .action-button:hover {
        background: #7c3aed;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
    }

    /* Scanner Styles */
    .scanner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
    }

    #reader {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #8b5cf6;
        background: black;
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
    }

    .cancel-scan-btn:hover {
        background: #ef4444;
        color: white;
    }

    .footer-status {
        margin-top: auto;
    }

    .loading-line {
        width: 100%;
        height: 2px;
        background: rgba(255, 255, 255, 0.1);
        margin-bottom: 0.5rem;
        position: relative;
        overflow: hidden;
    }

    .loading-line::after {
        content: "";
        position: absolute;
        width: 30%;
        height: 100%;
        background: #8b5cf6;
        animation: scan-line 2s linear infinite;
    }

    @keyframes scan-line {
        from {
            left: -30%;
        }
        to {
            left: 100%;
        }
    }

    .footer-status span {
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        color: #94a3b8;
        letter-spacing: 1px;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.2);
        }
    }
</style>
