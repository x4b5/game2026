<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";

    let visible = $state(false);
    let isScanning = $state(false);
    let scanner: any = null;

    let isNewMission = $state(false);

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
        // Here we can define where the player goes after scanning the bedroom code
        // For now, let's go back to the dashboard or a placeholder for the final mission

        if (
            code === "slaapkamerluca" ||
            code === "luca" ||
            code === "geheim" ||
            code === "hidden"
        ) {
            // Success! Mission point reached
            goto("/game"); // Update this later if there's a specific final mission page
            return;
        }

        // Generic navigation fallback
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
            <span>TARGET GELOKALISEERD</span>
        </div>

        <h1>MISSIE: WYCK</h1>

        {#if isNewMission}
            <div class="new-mission-briefing" in:fly={{ y: 20 }}>
                <div class="mission-header">
                    <span class="pulse-tag"
                        >NIEUWE OPDRACHT: DE SCHUILPLAATS</span
                    >
                </div>
                <p>
                    De elite-aliens hebben zich verschanst in de slaapkamer. We
                    hebben informatie dat ze een <strong
                        >interdimensionaal portaal</strong
                    > proberen te openen.
                </p>
                <div class="objective-list">
                    <div class="objective-item">
                        <span class="icon">🔍</span>
                        <span>Vind de verborgen QR-code in de kamer.</span>
                    </div>
                    <div class="objective-item">
                        <span class="icon">⚡</span>
                        <span
                            >Neutraliseer het portaal voor het te laat is.</span
                        >
                    </div>
                </div>
                <button class="scan-btn pulse" onclick={startScanner}>
                    📷 START SCAN & NEUTRALISEER
                </button>
            </div>
        {:else if isScanning}
            <div class="scanner-container" transition:slide>
                <div class="scanner-info">
                    <p>
                        Scan de QR-code bij <strong>Wyck</strong> om de ontsnapte
                        aliens in de val te lokken.
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
                    Het signaal is kristalhelder. De aliens blijken te vluchten
                    naar Wyck. <br />
                    Wees voorzichtig, ze zijn in het nauw gedreven!
                </p>
                <div class="location-hint">📍 LOCATIE: Wyck</div>
                <button class="scan-btn" onclick={() => (isNewMission = true)}>
                    📷 BEVESTIG ARRIVAL
                </button>
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

    .briefing p {
        color: #cbd5e1;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .location-hint {
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
        padding: 0.75rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        margin-bottom: 2rem;
        border: 1px dashed rgba(59, 130, 246, 0.4);
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
        padding: 1rem;
        border-radius: 12px;
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

    .scan-btn.pulse {
        animation: subtlePulse 2s infinite;
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
</style>
