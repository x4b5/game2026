<script lang="ts">
    const MISSIONS = [
        { name: "Nebula Post", slug: "x7-alpha-92", id: "nebula-post" },
        { name: "Vortex Hub", slug: "delta-vortex-11", id: "vortex-hub" },
        { name: "Nexus Core", slug: "sigma-nexus-4", id: "nexus-core" },
        { name: "Omega Rift", slug: "omega-rift-55", id: "omega-rift" },
        { name: "Gamma Prime", slug: "gamma-prime-8", id: "gamma-prime" },
        { name: "Zeta Flux", slug: "zeta-flux-33", id: "zeta-flux" },
        { name: "Theta Pulse", slug: "theta-pulse-19", id: "theta-pulse" },
        { name: "Kappa Grid", slug: "kappa-grid-27", id: "kappa-grid" },
        { name: "Iota Stream", slug: "iota-stream-6", id: "iota-stream" },
        { name: "Rho System", slug: "rho-system-88", id: "rho-system" },
    ];
</script>

<div class="admin-container">
    <header class="animate-fade-in">
        <h1>QR Code Dashboard</h1>
        <p>
            Download of scan de codes om de missies te koppelen aan fysieke
            locaties.
        </p>
    </header>

    <div class="qr-grid">
        {#each MISSIONS as mission}
            <div class="qr-card glass-panel animate-fade-in">
                <div class="qr-preview">
                    <img
                        src="/qr-codes/{mission.id}.png"
                        alt="QR for {mission.name}"
                    />
                </div>
                <div class="info">
                    <h3>{mission.name}</h3>
                    <code class="slug">/game/{mission.slug}</code>
                    <a
                        href="/qr-codes/{mission.id}.png"
                        download="{mission.id}-qr.png"
                        class="btn-download"
                    >
                        Download PNG
                    </a>
                    <a
                        href="/game/{mission.slug}"
                        class="btn-view"
                        target="_blank"
                    >
                        Bekijk Pagina
                    </a>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .admin-container {
        padding: 2rem 0;
    }

    header {
        text-align: center;
        margin-bottom: 3rem;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .qr-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
    }

    .qr-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: transform 0.3s ease;
    }

    .qr-card:hover {
        transform: translateY(-5px);
    }

    .qr-preview {
        background: white;
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .qr-preview img {
        max-width: 100%;
        height: auto;
    }

    .info h3 {
        margin-bottom: 0.5rem;
    }

    .slug {
        display: block;
        font-size: 0.8rem;
        color: var(--primary);
        background: rgba(99, 102, 241, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
    }

    .btn-download,
    .btn-view {
        display: block;
        width: 100%;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        transition: all 0.2s ease;
    }

    .btn-download {
        background: var(--primary);
        color: white;
    }

    .btn-download:hover {
        filter: brightness(1.1);
    }

    .btn-view {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        color: white;
    }

    .btn-view:hover {
        background: rgba(255, 255, 255, 0.1);
    }
</style>
