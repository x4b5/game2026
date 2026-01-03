<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        FilesetResolver,
        HandLandmarker,
        type HandLandmarkerResult,
    } from "@mediapipe/tasks-vision";
    import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

    let {
        onResults = (res: HandLandmarkerResult) => {},
        autoStart = false,
        showDebug = false,
    } = $props();

    let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let handLandmarker: HandLandmarker | undefined = $state(undefined);
    let webcamRunning = $state(false);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let lastVideoTime = -1;
    let animationFrameId: number;

    onMount(async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
            );
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 2,
            });
            loading = false;

            if (autoStart) {
                enableCam();
            }
        } catch (e) {
            console.error("Error initializing hand tracking:", e);
            error = "Failed to initialize hand tracking";
            loading = false;
        }
    });

    onDestroy(() => {
        if (webcamRunning) {
            webcamRunning = false;
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    export function enableCam() {
        if (!handLandmarker) {
            console.log("Wait! objectDetector not loaded yet.");
            return;
        }

        if (webcamRunning === true) {
            webcamRunning = false;
            // Stop stream
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoElement.srcObject = null;
            }
            // clear canvas
            const canvasCtx = canvasElement.getContext("2d");
            if (canvasCtx)
                canvasCtx.clearRect(
                    0,
                    0,
                    canvasElement.width,
                    canvasElement.height,
                );
        } else {
            webcamRunning = true;
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoElement.srcObject = stream;
                    videoElement.addEventListener("loadeddata", predictWebcam);
                })
                .catch((err) => {
                    console.error("Error accessing webcam:", err);
                    error = "Camera access denied or missing";
                    webcamRunning = false;
                });
        }
    }

    async function predictWebcam() {
        if (!videoElement || !canvasElement) return;

        // Resize canvas to match video
        if (
            videoElement.videoWidth !== canvasElement.width ||
            videoElement.videoHeight !== canvasElement.height
        ) {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
        }

        let startTimeMs = performance.now();
        if (lastVideoTime !== videoElement.currentTime) {
            lastVideoTime = videoElement.currentTime;

            if (handLandmarker) {
                const results = handLandmarker.detectForVideo(
                    videoElement,
                    startTimeMs,
                );
                onResults(results);

                if (showDebug) {
                    const canvasCtx = canvasElement.getContext("2d");
                    if (canvasCtx) {
                        canvasCtx.save();
                        canvasCtx.clearRect(
                            0,
                            0,
                            canvasElement.width,
                            canvasElement.height,
                        );
                        if (results.landmarks) {
                            for (const landmarks of results.landmarks) {
                                drawConnectors(
                                    canvasCtx,
                                    landmarks,
                                    HandLandmarker.HAND_CONNECTIONS as any,
                                    {
                                        color: "#00FF00",
                                        lineWidth: 5,
                                    },
                                );
                                drawLandmarks(canvasCtx, landmarks, {
                                    color: "#FF0000",
                                    lineWidth: 2,
                                });
                            }
                        }
                        canvasCtx.restore();
                    }
                }
            }
        }

        if (webcamRunning) {
            animationFrameId = requestAnimationFrame(predictWebcam);
        }
    }
</script>

<div class="hand-tracker-container">
    {#if loading}
        <div class="loading">Loading AI Model...</div>
    {/if}
    {#if error}
        <div class="error">{error}</div>
    {/if}

    <div class="video-wrapper" class:hidden={!showDebug && !loading}>
        <!-- svelte-ignore a11y_media_has_caption -->
        <video bind:this={videoElement} autoplay playsinline></video>
        <canvas bind:this={canvasElement} class="output_canvas"></canvas>
    </div>
</div>

<style>
    .hand-tracker-container {
        position: relative;
    }

    .loading,
    .error {
        color: white;
        font-family: sans-serif;
        background: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 4px;
        display: inline-block;
    }

    .error {
        color: #ff4444;
    }

    .video-wrapper {
        position: relative;
        width: fit-content;
    }

    .video-wrapper.hidden {
        width: 0;
        height: 0;
        overflow: hidden;
        opacity: 0;
        position: absolute; /* Take out of flow */
    }

    video {
        border-radius: 8px;
        max-width: 100%;
        display: block;
        transform: scaleX(-1); /* Mirror effect */
    }

    .output_canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform: scaleX(-1); /* Mirror effect to match video */
    }
</style>
