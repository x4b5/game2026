<script lang="ts">
    import MissionPage from "$lib/components/MissionPage.svelte";
    import { onMount, onDestroy } from "svelte";
    import { fade, slide } from "svelte/transition";
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

<div class="zeta-page">
    {#if isScanning}
        <div class="scanner-container glass-panel" in:fade>
            <div class="scanner-header">
                <h2>CAMERA SYNC</h2>
                <div class="status-indicator">VOER OMGEVINGSCAN UIT</div>
            </div>
            <div id="reader"></div>
            <button class="stop-btn" onclick={stopScanner}>
                ❌ ANNULEER SCAN
            </button>
        </div>
    {:else}
        <div class="mission-wrapper">
            <MissionPage
                title="Zeta Flux"
                missionCode="ZETA-FLUX-33"
                description="De energiestromen komen hier samen. Circuit connector game komt binnenkort!"
                icon="⚡"
                color="#8b5cf6"
                qrName="zeta-flux"
            />
            <div class="action-bar">
                <button class="scan-btn" onclick={startScanner}>
                    📷 SCAN OMGEVING
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .zeta-page {
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .mission-wrapper {
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .action-bar {
        padding: 0 1rem;
    }

    .scan-btn {
        width: 100%;
        padding: 1.2rem;
        background: #8b5cf6;
        color: white;
        border: none;
        border-radius: 12px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    }

    .scan-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
    }

    /* Scanner Styles */
    .scanner-container {
        width: 100%;
        max-width: 450px;
        padding: 2rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #8b5cf6;
    }

    .scanner-header h2 {
        font-family: "Orbitron", sans-serif;
        color: white;
        margin-bottom: 0.5rem;
    }

    .status-indicator {
        color: #8b5cf6;
        font-size: 0.8rem;
        margin-bottom: 1.5rem;
        letter-spacing: 2px;
        animation: pulse 2s infinite;
    }

    #reader {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #8b5cf6;
        margin-bottom: 1.5rem;
    }

    .stop-btn {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid #ef4444;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        cursor: pointer;
        transition: all 0.2s;
    }

    .stop-btn:hover {
        background: #ef4444;
        color: white;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
