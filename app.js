import { savedPoses } from './presets.js';

let newRingBase64 = null;
const ringFile = document.getElementById('ringFile');
const previewArea = document.getElementById('previewArea');
const promptText = document.getElementById('promptText');
const runEngineBtn = document.getElementById('runEngineBtn');
const gridOutput = document.getElementById('outputGrid');
const globalStatus = document.getElementById('globalStatus');

// Monitor when you add your single target ring photo
ringFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            newRingBase64 = event.target.result.split(',')[1]; // Strip headers for raw channel data
            promptText.innerText = "Ring target recognized successfully!";
            previewArea.innerHTML = `<img src="${event.target.result}" />`;
            runEngineBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

// Automation Execution Controller
runEngineBtn.addEventListener('click', async () => {
    runEngineBtn.disabled = true;
    gridOutput.innerHTML = '';
    globalStatus.innerText = "Nano Banana 2 is evaluating compositions and spatial physics...";

    // Run the 9 conversions in parallel using separate execution tracks
    const taskPipelines = savedPoses.map(async (pose) => {
        // Build the layout placeholder container card immediately
        const card = document.createElement('div');
        card.className = 'pose-box';
        card.innerHTML = `
            <div id="spinner-${pose.id}" style="height:300px; display:flex; align-items:center; justify-content:center; background:#f9fafb; color:#4f46e5; font-size:0.9rem; font-weight:500;">AI Thinking Pass...</div>
            <span class="pose-meta">${pose.name}</span>
        `;
        gridOutput.appendChild(card);

        try {
            // Direct API call utilizing Nano Banana 2 Multi-Frame Context Layer
            const generationResult = await puter.ai.txt2img(
                `High-end luxury commercial jewelry product photography. Seamlessly extract the structural identity, gemstone facets, and metal materials of the item in the subject reference image, and place it perfectly into this exact layout arrangement and environment: ${pose.prompt}. Sharp focus, clear reflections, no shape distortion.`,
                {
                    model: "nano-banana-2", 
                    inputs: [
                        { type: "image", data: newRingBase64, role: "subject_identity" },
                        { type: "image", data: pose.refImage.split(',')[1], role: "composition_layout" }
                    ],
                    strength: 0.35, // Low shift threshold ensures the fine geometry of your ring is locked down
                    negative_prompt: "warped band, missing prongs, changed stone configuration, asymmetrical, low-res"
                }
            );

            // Output the finalized graphic to its slot frame
            document.getElementById(`spinner-${pose.id}`).innerHTML = `<img src="${generationResult.src}" />`;
            
            // Append instant download tool
            const dl = document.createElement('a');
            dl.className = 'dl-btn';
            dl.href = generationResult.src;
            dl.download = `rendered-${pose.name.toLowerCase().replace(/\s+/g, '-')}.png`;
            dl.innerText = "Download Clear Image";
            card.appendChild(dl);

        } catch (error) {
            console.error(error);
            document.getElementById(`spinner-${pose.id}`).innerText = "Pipeline processing timeout. Retrying...";
        }
    });

    await Promise.all(taskPipelines);
    globalStatus.innerText = "All 9 Nano Banana 2 rendering routines finished successfully!";
    runEngineBtn.disabled = false;
});
