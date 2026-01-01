<script lang="ts">
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";
    import { onMount, onDestroy } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";

    let showExtraInfo = $state(false);
    let isScanning = $state(false);
    let scanner: any = null;
    let adminPassword = $state("");

    onDestroy(() => {
        if (scanner) {
            scanner.clear().catch(console.error);
        }
    });

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
        let targetPath = "";
        if (decodedText.startsWith("http")) {
            try {
                const url = new URL(decodedText);
                if (url.pathname.startsWith("/game")) {
                    targetPath = url.pathname;
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            targetPath = `/game/${decodedText.toLowerCase()}`;
        }

        if (targetPath) {
            fetch("/api/mission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ navTo: targetPath }),
            }).catch(console.error);

            goto(targetPath);
        } else if (decodedText.startsWith("http")) {
            window.location.href = decodedText;
        }
    }

    function onScanFailure(error: any) {
        // console.warn(`Code scan error = ${error}`);
    }

    function startScanner() {
        isScanning = true;
        setTimeout(() => {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false,
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
    <!-- Military Background Elements -->
    <div class="animated-bg"></div>

    <div class="glass-panel content-card">
        <h1>RHO SYSTEM 88</h1>
        <h2 class="mission-title">DOELWIT SCAN</h2>

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
                    <strong>LOCATIE:</strong> KAZEMATTEN (THE MINCK)
                </p>
                <p>
                    U bevindt zich in de gevarenzone. Zoek de QR-code om het
                    systeem te ontgrendelen.
                </p>
                <p class="clue-text">
                    > TIP: Koudste plek van de laagste ruimte.
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
                        🔦 Gebruik je zaklamp indien nodig. Deze ruimte bevat
                        historische resten die de scanner kunnen verstoren.
                    </p>
                </div>
            {/if}

            <div class="mission-status">
                <div class="status-item">
                    <span class="label">Sector:</span>
                    <span class="value">MINCK</span>
                </div>
                <div class="status-item">
                    <span class="label">Status:</span>
                    <span class="value high">ACTIVE</span>
                </div>
            </div>

            <button class="action-button primary-action" onclick={startScanner}>
                <span class="icon">📷</span>
                <span class="text">START SCAN</span>
            </button>

            <!-- Admin Password Field -->
            <div class="admin-bypass">
                <input
                    type="password"
                    bind:value={adminPassword}
                    placeholder="Override Code..."
                    onkeydown={(e) => e.key === "Enter" && handleAdminBypass()}
                />
                <button onclick={handleAdminBypass}>AUTO-AUTH</button>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Military / Tactical Theme */
    :global(body) {
        background-color: #0a0a0a;
        color: #e2e8f0;
    }

    .challenge-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
        background: #050505;
        font-family: "Courier New", Courier, monospace;
    }

    /* Scanlines Overlay */
    .challenge-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
        );
        pointer-events: none;
        z-index: 10;
    }

    .animated-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        background: radial-gradient(
                circle at center,
                transparent 30%,
                rgba(16, 185, 129, 0.03) 70%
            ),
            linear-gradient(rgba(16, 185, 129, 0.02) 1px, transparent 1px),
            linear-gradient(
                90deg,
                rgba(16, 185, 129, 0.02) 1px,
                transparent 1px
            );
        background-size:
            100% 100%,
            40px 40px,
            40px 40px;
        z-index: -1;
    }

    .content-card {
        max-width: 600px;
        width: 100%;
        background: rgba(10, 20, 15, 0.95);
        border: 2px solid #10b981;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
        padding: 2.5rem;
        position: relative;
        clip-path: polygon(
            0 0,
            20px 0,
            20px 20px,
            calc(100% - 20px) 20px,
            calc(100% - 20px) 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            20px 100%,
            0 calc(100% - 20px)
        );
    }

    h1 {
        font-family: "Orbitron", sans-serif;
        color: #10b981;
        font-size: 1rem;
        letter-spacing: 4px;
        margin-bottom: 0.5rem;
        text-align: center;
        text-transform: uppercase;
    }

    .mission-title {
        font-family: "Orbitron", sans-serif;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 2rem;
        text-transform: uppercase;
        color: white;
        text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
    }

    .briefing-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #e2e8f0;
        margin-bottom: 2rem;
        text-align: center;
        background: rgba(16, 185, 129, 0.1);
        padding: 1.5rem;
        border-left: 3px solid #10b981;
    }

    .clue-text {
        margin-top: 1rem;
        font-weight: bold;
        color: #10b981;
    }

    .primary-action {
        width: 100%;
        padding: 1.5rem;
        background: #10b981;
        color: black;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        transition: all 0.2s;
        clip-path: polygon(
            15px 0,
            100% 0,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            0 100%,
            0 15px
        );
    }

    .primary-action .text {
        font-family: "Orbitron", sans-serif;
        font-weight: 900;
        font-size: 1.3rem;
        letter-spacing: 2px;
    }

    .primary-action:hover {
        background: #34d399;
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
    }

    .info-toggle-btn {
        background: transparent;
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #10b981;
        padding: 0.8rem 1.5rem;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        width: 100%;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .info-toggle-btn:hover,
    .info-toggle-btn.active {
        background: rgba(16, 185, 129, 0.1);
        border-color: #10b981;
    }

    .extra-info-panel {
        background: rgba(0, 0, 0, 0.3);
        border: 1px dashed rgba(16, 185, 129, 0.3);
        padding: 1rem;
        margin-bottom: 2rem;
        text-align: center;
        color: #94a3b8;
    }

    .mission-status {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .status-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
    }

    .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #64748b;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
        color: #10b981;
    }

    .value.high {
        color: #ef4444;
        animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .scanner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border: 1px solid #10b981;
    }

    #reader {
        width: 100%;
        background: black;
        border: 1px solid #10b981;
    }

    .cancel-scan-btn {
        background: transparent;
        color: #ef4444;
        border: 1px solid #ef4444;
        padding: 0.8rem 1.5rem;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
    }

    .admin-bypass {
        margin-top: 2rem;
        display: flex;
        gap: 0.5rem;
        opacity: 0.3;
        transition: opacity 0.3s;
    }

    .admin-bypass:hover {
        opacity: 1;
    }

    .admin-bypass input {
        flex: 1;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 0.8rem;
        color: #10b981;
        font-family: monospace;
    }

    .admin-bypass button {
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid #10b981;
        color: #10b981;
        padding: 0.8rem;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
    }
</style>
