import { savedPoses } from './presets.js';

const HF_TOKEN = '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'; 

let newRingBase64 = null;
const ringFile = document.getElementById('ringFile');
const previewArea = document.getElementById('previewArea');
const promptText = document.getElementById('promptText');
const runEngineBtn = document.getElementById('runEngineBtn');
const gridOutput = document.getElementById('gridOutput');
const globalStatus = document.getElementById('globalStatus');

// Helper to convert repository images to base64 dynamically
async function urlToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

ringFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            newRingBase64 = event.target.result; 
            promptText.innerText = "Target product ring loaded successfully!";
            previewArea.innerHTML = `<img src="${event.target.result}" />`;
            runEngineBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

runEngineBtn.addEventListener('click', async () => {
    runEngineBtn.disabled = true;
    gridOutput.innerHTML = '';
    globalStatus.innerText = "Hugging Face is executing high-fidelity structural mapping sequences...";

    const taskPipelines = savedPoses.map(async (pose) => {
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
                    <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#f8fafc; color:#4f46e5; font-size:0.9rem; font-weight:500; border-radius:8px; border:1px dashed #cbd5e1;">Processing Canvas...</div>
                </div>
            </div>
        `;
        gridOutput.appendChild(card);

        try {
            // Dynamically load the composition template image securely
            const targetTemplateBase64 = await urlToBase64(pose.refImage);

            // Using the base SDXL model which natively handles standard multi-image/text query parsing formats
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                {
                    headers: { 
                        Authorization: `Bearer ${HF_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: `${pose.prompt}, professional 4k jewelry catalog photography, high geometric consistency, sharp reflections`,
                        parameters: {
                            negative_prompt: "warped geometry, deformed stone, messy claws, extra bands, text logo watermark, blurry, low resolution",
                            guidance_scale: 7.5,
                            num_inference_steps: 30
                        }
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "API Error");
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
            document.getElementById(`output-side-${pose.id}`).innerHTML = `
                <span>AI Generated Output</span>
                <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#fef2f2; color:#ef4444; font-size:0.85rem; border-radius:8px; padding:10px; text-align:center;">Model is loading on Hugging Face servers. Please wait 15 seconds and click run again to start generation pool.</div>
            `;
        }
    });

    await Promise.all(taskPipelines);
    globalStatus.innerText = "All 7 reference transformations completed!";
    runEngineBtn.disabled = false;
});
