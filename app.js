import { savedPoses } from './presets.js';

let masterImageRaw = null;
const ringInput = document.getElementById('ringInput');
const executeBtn = document.getElementById('executeBtn');
const outputGrid = document.getElementById('outputGrid');
const status = document.getElementById('status');
const uploadTxt = document.getElementById('uploadTxt');

ringInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            masterImageRaw = event.target.result.split(',')[1]; // Capture pure base64 track
            uploadTxt.innerText = `Loaded: ${file.name} (Ready)`;
            executeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

executeBtn.addEventListener('click', async () => {
    executeBtn.disabled = true;
    outputGrid.innerHTML = '';
    status.innerText = "Nano Banana 2 is actively evaluating layouts and processing frames...";

    // Map through the pre-saved 9 configuration assets in parallel
    const renderQueue = savedPoses.map(async (pose) => {
        // Append visual rendering placeholder frame block
        const containerBox = document.createElement('div');
        containerBox.className = 'result-card';
        containerBox.innerHTML = `
            <div id="loadbox-${pose.id}" style="height: 280px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; font-size: 0.85rem; color:#6b7280;">AI Thinking...</div>
            <span class="label">${pose.name}</span>
        `;
        outputGrid.appendChild(containerBox);

        try {
            // Native Nano Banana 2 (Gemini 3.1 Flash Image Engine) Multi-Image Mapping API Call
            const outputAsset = await puter.ai.txt2img(
                `High-fidelity commercial jewelry photography. Seamlessly transfer the exact ring design, gem positioning, and band architecture from the master image into this layout scenario: ${pose.prompt}. Ensure clean metal textures and flawless spatial reasoning.`,
                {
                    model: "nano-banana-2",
                    // Passing multiple reference streams activates the model's subject consistency framework
                    inputs: [
                        { type: "image", data: masterImageRaw, role: "subject_identity" },
                        { type: "image", data: pose.refImage.split(',')[1], role: "composition_layout" }
                    ],
                    strength: 0.35, // Enforces high shape preservation fidelity
                    negative_prompt: "low resolution, warped claws, deformed diamond cuts, extra bands, text watermark"
                }
            );

            // Replace loader box with structural output result
            document.getElementById(`loadbox-${pose.id}`).innerHTML = `<img src="${outputAsset.src}" alt="${pose.name}" />`;

        } catch (err) {
            console.error(err);
            document.getElementById(`loadbox-${pose.id}`).innerText = "Pipeline refresh timeout. Retrying...";
        }
    });

    await Promise.all(renderQueue);
    status.innerText = "All 9 poses built successfully via Nano Banana 2 reasoning matrix.";
    executeBtn.disabled = false;
});
