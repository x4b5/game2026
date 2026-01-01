<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";

    let visible = $state(false);
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

    function onScanSuccess(decodedText: string) {
        console.log("QR Scanned:", decodedText);

        const rawCode = decodedText.trim();
        const code = rawCode.toLowerCase();

        if (scanner) {
            scanner
                .clear()
                .then(() => {
                    isScanning = false;
                    scanner = null;
                    handleNavigation(rawCode, code);
                })
                .catch((err: any) => {
                    console.error("Scanner clear failed:", err);
                    handleNavigation(rawCode, code);
                });
        } else {
            handleNavigation(rawCode, code);
        }
    }

    function handleNavigation(rawCode: string, code: string) {
        // Redirigé naar Theta Pulse na de scan op het Vrijthof
        if (
            code === "vrijthof" ||
            code === "finale" ||
            code === "theta-pulse" ||
            code.includes("theta")
        ) {
            goto("/game/theta-pulse-19");
            return;
        }

        if (rawCode.startsWith("http")) {
            try {
                const url = new URL(rawCode);
                if (url.pathname.startsWith("/game")) {
                    goto(url.pathname);
                } else {
                    window.location.href = rawCode;
                }
            } catch (e) {
                window.location.href = rawCode;
            }
        } else {
            const cleanCode = rawCode.startsWith("/")
                ? rawCode.slice(1)
                : rawCode;
            goto(`/game/${cleanCode}`);
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

<div class="scan-page" in:fade>
    <div class="content-panel glass-panel">
        <div class="status-header">
            <div class="pulse-dot"></div>
            <span>NIEUWE LOCATIE VEREIST</span>
        </div>

        <h1>ONDERWEG NAAR HET VRIJTHOF</h1>

        {#if isScanning}
            <div class="scanner-container" transition:slide>
                <div class="scanner-info">
                    <p>
                        Zoek de QR-code bij het <strong>Vrijthof</strong> (brievenbus)
                        om je aankomst te bevestigen.
                    </p>
                </div>
                <div id="reader"></div>
                <button class="cancel-btn" onclick={stopScanner}>
                    ❌ ANNULEER SCAN
                </button>
            </div>
        {:else}
            <div class="briefing">
                <p>
                    Viool beveiligd? Check. <br />
                    Nu is het tijd om de aliens te confronteren bij hun verzamelpunt.
                </p>
                <button class="scan-btn" onclick={startScanner}>
                    📷 BEVESTIG LOCATIE
                </button>
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
        margin-bottom: 2.5rem;
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

    .scanner-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
    }

    .scanner-info {
        background: rgba(59, 130, 246, 0.1);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .scanner-info p {
        color: #dbeafe;
        font-size: 0.9rem;
        margin: 0;
    }

    #reader {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #3b82f6;
    }

    .cancel-btn {
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
        border: 1px solid #ef4444;
        padding: 0.8rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
    }

    .cancel-btn:hover {
        background: #ef4444;
        color: white;
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
