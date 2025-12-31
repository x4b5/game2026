<script lang="ts">
    let {
        title,
        missionCode,
        description,
        icon = "🚀",
        color = "var(--primary)",
        qrName = "",
    } = $props();
</script>

<div class="mission-container animate-fade-in">
    <div class="glass-panel mission-card" style:--accent-color={color}>
        <div class="status-bar">
            <span class="live-dot"></span>
            LOCATIE BEVESTIGD
        </div>

        <div class="header">
            <div class="icon-circle" style:background={color}>
                {icon}
            </div>
            <div>
                <h1>{title}</h1>
                <p class="code">Sector: {missionCode}</p>
            </div>
        </div>

        <div class="content">
            {#if qrName}
                <div class="qr-confirmation">
                    <div class="mini-qr-box">
                        <img src="/qr-codes/{qrName}.png" alt="QR Protocol" />
                    </div>
                    <div class="qr-text">
                        <strong>Protocol Geactiveerd</strong>
                        <span>Scan bevestigd via QR</span>
                    </div>
                </div>
            {/if}

            <p>{description}</p>

            <div class="task-box">
                <h3>Opdracht:</h3>
                <ul>
                    <li>Scan de omgeving voor aanwijzingen.</li>
                    <li>Los het raadsel van de {title} op.</li>
                    <li>Voer de resultaten in op je dashboard.</li>
                </ul>
            </div>

            <button class="btn-action" style:background={color}>
                Start Missie
            </button>
        </div>
    </div>
</div>

<style>
    .mission-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 1rem;
    }

    .mission-card {
        max-width: 500px;
        width: 100%;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .mission-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--accent-color);
    }

    .status-bar {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--text-muted);
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .live-dot {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        box-shadow: 0 0 10px #22c55e;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
        100% {
            opacity: 1;
        }
    }

    .header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .icon-circle {
        width: 60px;
        height: 60px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        color: white;
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
    }

    h1 {
        font-size: 1.75rem;
        margin-bottom: 0.25rem;
    }

    .code {
        font-family: monospace;
        color: var(--accent-color);
        font-weight: 700;
    }

    .qr-confirmation {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(255, 255, 255, 0.03);
        padding: 0.75rem;
        border-radius: 12px;
        border: 1px solid var(--glass-border);
        margin-bottom: 1.5rem;
    }

    .mini-qr-box {
        background: white;
        padding: 0.25rem;
        border-radius: 4px;
        width: 40px;
        height: 40px;
    }

    .mini-qr-box img {
        width: 100%;
        height: 100%;
    }

    .qr-text {
        display: flex;
        flex-direction: column;
    }

    .qr-text strong {
        font-size: 0.85rem;
        color: var(--text-main);
    }

    .qr-text span {
        font-size: 0.7rem;
        color: var(--text-muted);
    }

    .content p {
        color: var(--text-muted);
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .task-box {
        background: rgba(0, 0, 0, 0.2);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    h3 {
        font-size: 1rem;
        margin-bottom: 0.75rem;
        color: var(--text-main);
    }

    ul {
        padding-left: 1.25rem;
        color: var(--text-muted);
        font-size: 0.95rem;
    }

    li {
        margin-bottom: 0.5rem;
    }

    .btn-action {
        width: 100%;
        padding: 1rem;
        border-radius: 12px;
        color: white;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition:
            transform 0.2s ease,
            filter 0.2s ease;
    }

    .btn-action:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
    }
</style>
