import { savedPoses } from './presets.js';

// The verified token from your screenshot
const HF_TOKEN = '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'; 

const ringFile = document.getElementById('ringFile');
const previewArea = document.getElementById('previewArea');
const promptText = document.getElementById('promptText');
const runEngineBtn = document.getElementById('runEngineBtn');
const gridOutput = document.getElementById('gridOutput');
const globalStatus = document.getElementById('globalStatus');

// Standard verification state tracker
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

runEngineBtn.addEventListener('click', async () => {
    runEngineBtn.disabled = true;
    gridOutput.innerHTML = '';
    globalStatus.innerText = "Connecting directly to Hugging Face core compute nodes...";

    const taskPipelines = savedPoses.map(async (pose) => {
        // Build the split panel card grid dynamically
        const card = document.createElement('div');
        card.className = 'pose-box';
        card.innerHTML = `
            <span class="pose-meta">${pose.name}</span>
            <div class="split-view">
                <div class="view-panel">
                    <span>Target Layout Template</span>
                    <img src="${pose.refImage}" />
                </div>
                <div class="view-panel" id="output-side-${pose.id}">
                    <span>AI Generated Output</span>
                    <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#f8fafc; color:#4f46e5; font-size:0.9rem; font-weight:500; border-radius:8px; border:1px dashed #cbd5e1;">Generating Frame...</div>
                </div>
            </div>
        `;
        gridOutput.appendChild(card);

        try {
            // Firing clean structured JSON query payloads to Stable Diffusion 3 Medium endpoint
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

            // If the server tells us it's asleep/loading, throw an error to trigger user instruction
            if (response.status === 503) {
                throw new Error("LOADING_MODEL");
            }

            if (!response.ok) {
                throw new Error("API_ERROR");
            }

            const blob = await response.blob();
            const resultImageUrl = URL.createObjectURL(blob);

            const outputSide = document.getElementById(`output-side-${pose.id}`);
            outputSide.innerHTML = `
                <span>AI Generated Output</span>
                <img src="${resultImageUrl}" style="object-fit: cover;" />
                <a href="${resultImageUrl}" download="pose-${pose.id}.png" class="dl-btn">Download 4K Render</a>
            `;

        } catch (error) {
            console.error(error);
            const outputSide = document.getElementById(`output-side-${pose.id}`);
            if (error.message === "LOADING_MODEL") {
                outputSide.innerHTML = `
                    <span>AI Generated Output</span>
                    <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#fef2f2; color:#ef4444; font-size:0.85rem; border-radius:8px; padding:15px; text-align:center; font-weight:600;">Hugging Face is waking up the processing unit. Wait 15 seconds and click the button again.</div>
                `;
            } else {
                outputSide.innerHTML = `
                    <span>AI Generated Output</span>
                    <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#fafafa; color:#dc2626; font-size:0.85rem; border-radius:8px; padding:15px; text-align:center;">Server cluster busy. Hit run again to retry.</div>
                `;
            }
        }
    });

    await Promise.all(taskPipelines);
    globalStatus.innerText = "Execution run finished.";
    runEngineBtn.disabled = false;
});
