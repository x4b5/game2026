<script lang="ts">
    import GameContainer from "$lib/components/GameContainer.svelte";
    import { soundManager } from "$lib/utils/SoundManager";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    interface TimeShard {
        id: number;
        currentAngle: number;
        targetAngle: number;
        color: string;
        label: string;
    }

    let gameContainer: any;
    let shards = $state<TimeShard[]>([]);
    let vortexRotation = $state(0);
    let isDragging = $state(false);
    let lastMouseAngle = 0;
    let vortexEl: HTMLDivElement;

    const TOLERANCE = 10; // degrees

    onMount(() => {
        initShards();
    });

    function initShards() {
        shards = [
            {
                id: 0,
                currentAngle: 45,
                targetAngle: 0,
                color: "#ec4899",
                label: "Past",
            },
            {
                id: 1,
                currentAngle: 135,
                targetAngle: 90,
                color: "#6366f1",
                label: "Present",
            },
            {
                id: 2,
                currentAngle: 225,
                targetAngle: 180,
                color: "#f59e0b",
                label: "Future",
            },
            {
                id: 3,
                currentAngle: 315,
                targetAngle: 270,
                color: "#10b981",
                label: "Beyond",
            },
        ];
    }

    function handlePointerDown(e: PointerEvent) {
        isDragging = true;
        const rect = vortexEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        lastMouseAngle =
            Math.atan2(e.clientY - centerY, e.clientX - centerX) *
            (180 / Math.PI);
        vortexEl.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: PointerEvent) {
        if (!isDragging) return;

        const rect = vortexEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle =
            Math.atan2(e.clientY - centerY, e.clientX - centerX) *
            (180 / Math.PI);

        const delta = currentAngle - lastMouseAngle;
        vortexRotation += delta;
        lastMouseAngle = currentAngle;

        // Update shard positions
        shards = shards.map((shard) => ({
            ...shard,
            currentAngle: (shard.currentAngle + delta + 360) % 360,
        }));

        checkAlignment();
    }

    function handlePointerUp(e: PointerEvent) {
        isDragging = false;
        vortexEl.releasePointerCapture(e.pointerId);
    }

    function checkAlignment() {
        const allAligned = shards.every((shard) => {
            const diff = Math.abs(shard.currentAngle - shard.targetAngle);
            return diff < TOLERANCE || diff > 360 - TOLERANCE;
        });

        if (allAligned) {
            setTimeout(() => {
                gameContainer?.win(2000);
                setTimeout(() => {
                    goto("/game/mosa-bridge-44");
                }, 2000);
            }, 300);
        }
    }

    function isAligned(shard: TimeShard): boolean {
        const diff = Math.abs(shard.currentAngle - shard.targetAngle);
        return diff < TOLERANCE || diff > 360 - TOLERANCE;
    }
</script>

<GameContainer
    bind:this={gameContainer}
    gameId="bathroom-lock"
    title="🔒 Badkamer Vergrendeling"
>
    <div class="vortex-game">
        <div class="instructions">
            <p>Draai de ringen om het slot van de badkamer te openen.</p>
        </div>

        <div
            bind:this={vortexEl}
            class="vortex-container"
            class:dragging={isDragging}
            role="slider"
            tabindex="0"
            aria-label="Time vortex rotation control"
            onpointerdown={handlePointerDown}
            onpointermove={handlePointerMove}
            onpointerup={handlePointerUp}
        >
            <!-- Vortex center -->
            <div
                class="vortex-center"
                style:transform="rotate({vortexRotation}deg)"
            >
                <div class="vortex-spiral"></div>
            </div>

            <!-- Time shards -->
            {#each shards as shard}
                <div
                    class="time-shard"
                    class:aligned={isAligned(shard)}
                    style:transform="rotate({shard.currentAngle}deg)
                    translateY(max(-120px, -24vw))"
                    style:--shard-color={shard.color}
                >
                    <div
                        class="shard-content"
                        style:transform="rotate({-shard.currentAngle}deg)"
                    >
                        <div class="shard-glow"></div>
                        {shard.label}
                    </div>
                </div>

                <!-- Target marker -->
                <div
                    class="target-marker"
                    style:transform="rotate({shard.targetAngle}deg)
                    translateY(max(-120px, -24vw))"
                >
                    <div
                        class="marker-dot"
                        style:background={shard.color}
                    ></div>
                </div>
            {/each}
        </div>

        <div class="alignment-status">
            {shards.filter((s) => isAligned(s)).length} / {shards.length} ontgrendeld
        </div>
    </div>
</GameContainer>

<style>
    .vortex-game {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    .instructions {
        text-align: center;
        margin-bottom: 2rem;
        color: var(--text-muted);
    }

    .vortex-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(236, 72, 153, 0.2),
            rgba(99, 102, 241, 0.2)
        );
        border: 2px solid var(--glass-border);
        cursor: grab;
        touch-action: none;
        user-select: none;
    }

    .vortex-container.dragging {
        cursor: grabbing;
    }

    .vortex-center {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80px;
        height: 80px;
        transform-origin: center;
        transition: transform 0.1s linear;
    }

    .vortex-spiral {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(236, 72, 153, 0.4) 90deg,
            transparent 180deg,
            rgba(99, 102, 241, 0.4) 270deg,
            transparent 360deg
        );
        border-radius: 50%;
        animation: spin 10s linear infinite;
    }

    @keyframes spin {
        to {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }

    .time-shard {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        transform-origin: center;
        transition: all 0.2s ease;
    }

    .shard-content {
        position: absolute;
        transform: translate(-50%, -50%);
        padding: 0.75rem 1.25rem;
        background: var(--glass);
        border: 2px solid var(--shard-color);
        border-radius: 12px;
        color: white;
        font-weight: 700;
        font-size: 0.875rem;
        white-space: nowrap;
        box-shadow: 0 0 20px var(--shard-color);
        transition: all 0.3s ease;
    }

    .time-shard.aligned .shard-content {
        border-color: #22c55e;
        box-shadow: 0 0 30px #22c55e;
        background: rgba(34, 197, 94, 0.2);
    }

    .target-marker {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        transform-origin: center;
        pointer-events: none;
    }

    .marker-dot {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.5;
        animation: pulse-marker 2s ease-in-out infinite;
    }

    @keyframes pulse-marker {
        0%,
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.8;
        }
    }

    .alignment-status {
        margin-top: 2rem;
        text-align: center;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary);
    }

    @media (max-width: 640px) {
        .shard-content {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
        }
    }
</style>
