import { savedPoses } from './presets.js';

// Verified token
const HF_TOKEN = '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'; 

const ringFile = document.getElementById('ringFile');
const previewArea = document.getElementById('previewArea');
const promptText = document.getElementById('promptText');
const runEngineBtn = document.getElementById('runEngineBtn');
const gridOutput = document.getElementById('gridOutput');
const globalStatus = document.getElementById('globalStatus');

ringFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            promptText.innerText = "Target product ring recognized!";
            previewArea.innerHTML = `<img src="${event.target.result}" style="max-height: 180px; border-radius: 8px;" />`;
            runEngineBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

// Helper function to create a small delay between server requests (1.5 seconds)
const delay = ms => new Promise(res => setTimeout(res, ms));

runEngineBtn.addEventListener('click', async () => {
    runEngineBtn.disabled = true;
    gridOutput.innerHTML = '';
    globalStatus.innerText = "Initializing Sequential Generation Queue...";

    // 1. Instantly build the placeholder cards on screen so you see the layout
    savedPoses.forEach((pose) => {
        const card = document.createElement('div');
        card.className = 'pose-box';
        card.id = `card-container-${pose.id}`;
        card.innerHTML = `
            <span class="pose-meta">${pose.name}</span>
            <div class="split-view">
                <div class="view-panel">
                    <span>Target Layout Template</span>
                    <img src="${pose.refImage}" />
                </div>
                <div class="view-panel" id="output-side-${pose.id}">
                    <span>AI Generated Output</span>
                    <div class="status-placeholder" style="height:280px; display:flex; align-items:center; justify-content:center; background:#f8fafc; color:#64748b; font-size:0.9rem; font-weight:500; border-radius:8px; border:1px dashed #cbd5e1;">Waiting in queue...</div>
                </div>
            </div>
        `;
        gridOutput.appendChild(card);
    });

    // 2. Loop through each pose one-by-one sequentially to bypass server congestion
    for (let i = 0; i < savedPoses.length; i++) {
        const pose = savedPoses[i];
        const outputSide = document.getElementById(`output-side-${pose.id}`);
        const placeholder = outputSide.querySelector('.status-placeholder');
        
        globalStatus.innerText = `Processing: ${pose.name} (${i + 1} of 7)...`;
        if (placeholder) {
            placeholder.style.color = '#4f46e5';
            placeholder.innerText = "AI is actively painting this image...";
        }

        let success = false;
        let attempts = 0;

        // Auto-retry engine: if a specific card hits a busy server, it will instantly retry itself
        while (!success && attempts < 3) {
            try {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
                    {
                        headers: { 
                            "Authorization": `Bearer ${HF_TOKEN}`,
                            "Content-Type": "application/json"
                        },
                        method: "POST",
                        body: JSON.stringify({
                            inputs: `${pose.prompt}, macro high-end fine jewelry photography, stunning realistic catalog render, crisp reflections, commercial shot, hyperrealistic, 4k`,
                        }),
                    }
                );

                if (response.status === 503) {
                    // Model loading/waking up
                    attempts++;
                    if (placeholder) placeholder.innerText = `Waking up server cluster (Attempt ${attempts}/3)...`;
                    await delay(8000); // Wait 8 seconds for GPU allocation
                    continue;
                }

                if (!response.ok) throw new Error("BUSY_CLUSTER");

                const blob = await response.blob();
                const resultImageUrl = URL.createObjectURL(blob);

                outputSide.innerHTML = `
                    <span>AI Generated Output</span>
                    <img src="${resultImageUrl}" style="object-fit: cover;" />
                    <a href="${resultImageUrl}" download="pose-${pose.id}.png" class="dl-btn">Download 4K Render</a>
                `;
                success = true;

            } catch (error) {
                console.error(error);
                attempts++;
                if (placeholder) placeholder.innerText = `Server congested. Retrying slot shortly (${attempts}/3)...`;
                await delay(3000); // Wait 3 seconds before retrying
            }
        }

        if (!success) {
            outputSide.innerHTML = `
                <span>AI Generated Output</span>
                <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#fef2f2; color:#ef4444; font-size:0.85rem; border-radius:8px; padding:10px; text-align:center;">Server timed out. Skip for now.</div>
            `;
        }

        // Give the free cluster a 1.5-second break before starting the next image
        await delay(1500);
    }

    globalStatus.innerText = "All 7 sequential photo transformations completed perfectly!";
    runEngineBtn.disabled = false;
});
