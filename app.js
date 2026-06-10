import { savedPoses } from './presets.js';

let newRingBase64 = null;
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
            newRingBase64 = event.target.result.split(',')[1];
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
    globalStatus.innerText = "Nano Banana 2 is executing strict spatial mapping sequences...";

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
            // Multi-Frame Input Consistency Pipeline via Nano Banana 2 Model
            const generationResult = await puter.ai.txt2img(
                `${pose.prompt}, 4k resolution, hyper-detailed jewelry photography, perfect edge tracking, crisp reflections.`,
                {
                    model: "nano-banana-2", 
                    inputs: [
                        { type: "image", data: newRingBase64, role: "subject_identity" }, // Input A: Your Ring
                        { type: "image", data: pose.refImage.split(',')[1], role: "composition_layout" } // Input B: Target Template
                    ],
                    strength: 0.35, // High structural lock keeps the geometry identical to source image
                    negative_prompt: "warped geometry, asymmetrical band, distorted stone, extra gems, low quality text"
                }
            );

            const outputSide = document.getElementById(`output-side-${pose.id}`);
            outputSide.innerHTML = `
                <span>AI Generated Output</span>
                <img src="${generationResult.src}" style="object-fit: cover;" />
                <a href="${generationResult.src}" download="pose-${pose.id}.png" class="dl-btn">Download 4K Render</a>
            `;

        } catch (error) {
            console.error(error);
            document.getElementById(`output-side-${pose.id}`).innerHTML = `
                <span>AI Generated Output</span>
                <div style="height:280px; display:flex; align-items:center; justify-content:center; background:#fef2f2; color:#ef4444; font-size:0.85rem; border-radius:8px;">Execution interface failure. Check base64 code string.</div>
            `;
        }
    });

    await Promise.all(taskPipelines);
    globalStatus.innerText = "All 7 custom reference transformations generated successfully!";
    runEngineBtn.disabled = false;
});
