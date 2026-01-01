<script lang="ts">
    import { gameProgress, MISSION_ORDER } from "$lib/stores/gameStore";
    import { onMount, onDestroy } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { Html5QrcodeScanner } from "html5-qrcode";

    let visible = $state(false);
    let showExtraInfo = $state(false);
    let isScanning = $state(false);
    let scanner: any = null;
    let adminPassword = $state("");

    onMount(() => {
        visible = true;
    });

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
            // Tell everyone else to follow
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
    <!-- Spectacular Background Elements -->
    <div class="animated-bg"></div>
    <div class="particles">
        {#each { length: 20 } as _, i}
            <div class="particle" style="--i:{i}"></div>
        {/each}
    </div>
    <div class="cyber-grid"></div>

    <div class="glass-panel content-card has-corners">
        <!-- Cyber Corners -->
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>

        <h1>KAPPA GRID 27</h1>
        <h2 class="mission-title">MISSIE BRIEFING</h2>

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

            <button class="action-button primary-action" onclick={startScanner}>
                <span class="icon">📷</span>
                <span class="text">SCAN OMGEVING</span>
            </button>

            <!-- Admin Password Field -->
            <div class="admin-bypass">
                <input
                    type="password"
                    bind:value={adminPassword}
                    placeholder="Admin wachtwoord..."
                    onkeydown={(e) => e.key === "Enter" && handleAdminBypass()}
                />
                <button onclick={handleAdminBypass}>Doorgaan</button>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Animated Background & Effects */
    .animated-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            -45deg,
            #0f172a,
            #1e1b4b,
            #312e81,
            #1e293b,
            #0c4a6e
        );
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        z-index: -2;
    }

    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        top: -10px;
        left: calc(var(--i) * 5%);
        animation: fall linear infinite;
        animation-duration: calc(6s + var(--i) * 0.5s);
        animation-delay: calc(var(--i) * -0.5s);
        box-shadow:
            0 0 10px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(59, 130, 246, 0.6);
    }

    @keyframes fall {
        to {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
        }
    }

    .cyber-grid {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
                rgba(59, 130, 246, 0.08) 2px,
                transparent 2px
            ),
            linear-gradient(
                90deg,
                rgba(59, 130, 246, 0.08) 2px,
                transparent 2px
            );
        background-size: 60px 60px;
        perspective: 1000px;
        transform: perspective(500px) rotateX(20deg);
        z-index: -1.5;
        animation: gridPulse 8s ease-in-out infinite alternate;
    }

    @keyframes gridPulse {
        from {
            opacity: 0.3;
            transform: perspective(500px) rotateX(20deg) scale(1);
        }
        to {
            opacity: 0.6;
            transform: perspective(500px) rotateX(20deg) scale(1.05);
        }
    }

    /* Page Layout */
    .challenge-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        position: relative;
        overflow: hidden;
    }

    /* Glass Panel Card */
    .content-card {
        max-width: 600px;
        width: 100%;
        padding: 3rem;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(59, 130, 246, 0.3);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        position: relative;
    }

    /* Cyber Corners */
    .has-corners {
        clip-path: polygon(
            0 0,
            20px 0,
            0 20px,
            0 calc(100% - 20px),
            20px 100%,
            100% 100%,
            100% calc(100% - 20px),
            calc(100% - 20px) 0
        );
    }

    .corner {
        position: absolute;
        width: 15px;
        height: 15px;
        border-color: #60a5fa;
        border-style: solid;
        transition: all 0.3s ease;
    }

    .tl {
        top: 0;
        left: 0;
        border-width: 2px 0 0 2px;
    }
    .tr {
        top: 0;
        right: 0;
        border-width: 2px 2px 0 0;
    }
    .bl {
        bottom: 0;
        left: 0;
        border-width: 0 0 2px 2px;
    }
    .br {
        bottom: 0;
        right: 0;
        border-width: 0 2px 2px 0;
    }

    /* Typography */
    h1 {
        font-family: "Orbitron", sans-serif;
        color: #94a3b8;
        font-size: 1rem;
        letter-spacing: 6px;
        margin-bottom: 0.5rem;
        text-align: center;
        text-transform: uppercase;
    }

    .mission-title {
        font-family: "Orbitron", sans-serif;
        font-size: clamp(2rem, 5vw, 3rem);
        text-align: center;
        margin-bottom: 2.5rem;
        text-transform: uppercase;
        background: linear-gradient(135deg, white, #60a5fa);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(96, 165, 250, 0.4);
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .briefing-text {
        font-size: 1.15rem;
        line-height: 1.8;
        color: #e2e8f0;
        margin-bottom: 2.5rem;
        text-align: center;
        background: rgba(59, 130, 246, 0.1);
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 3px solid #60a5fa;
    }

    /* Buttons */
    .primary-action {
        width: 100%;
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--primary), #2563eb);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .primary-action .text {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.3rem;
        letter-spacing: 2px;
    }

    .primary-action .icon {
        font-size: 1.5rem;
    }

    .primary-action:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(37, 99, 235, 0.5);
    }

    .primary-action::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transform: rotate(45deg) translate(-100%, -100%);
        transition: transform 0.6s;
    }

    .primary-action:hover::after {
        transform: rotate(45deg) translate(100%, 100%);
    }

    .info-toggle-btn {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(96, 165, 250, 0.3);
        color: #94a3b8;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-family: "Orbitron", sans-serif;
        font-size: 0.95rem;
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
        background: rgba(59, 130, 246, 0.2);
        border-color: #60a5fa;
        color: white;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
    }

    /* Status Panel */
    .mission-status {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
    }

    .status-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #94a3b8;
        letter-spacing: 1px;
    }

    .value {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 1.4rem;
        color: white;
    }

    .value.high {
        color: #ef4444;
        text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
        animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
        0%,
        100% {
            text-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
        }
        50% {
            text-shadow: 0 0 25px rgba(239, 68, 68, 0.9);
        }
    }

    /* Scanner & Other UI */
    .scanner-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 12px;
    }

    #reader {
        width: 100%;
        background: black;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #3b82f6;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }

    .cancel-scan-btn {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        border: 1px solid #ef4444;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cancel-scan-btn:hover {
        background: rgba(239, 68, 68, 0.4);
        color: white;
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
    }

    .extra-info-panel {
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid #3b82f6;
        padding: 1.2rem;
        margin-bottom: 2rem;
        border-radius: 0 8px 8px 0;
        text-align: center;
        animation: slideIn 0.3s ease-out;
    }

    .admin-bypass {
        margin-top: 2rem;
        padding: 1rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        display: flex;
        gap: 0.5rem;
        opacity: 0.5;
        transition: opacity 0.3s;
    }

    .admin-bypass:hover {
        opacity: 1;
    }

    .admin-bypass input {
        flex: 1;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.8rem;
        border-radius: 6px;
        color: white;
        font-family: "Orbitron", sans-serif;
        font-size: 0.9rem;
    }

    .admin-bypass button {
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid #3b82f6;
        color: #60a5fa;
        padding: 0.8rem 1.2rem;
        border-radius: 6px;
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
    }
</style>
