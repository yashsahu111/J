let masterImageBase64 = null;
const slotsContainer = document.getElementById('slotsContainer');
const masterImageInput = document.getElementById('masterImageInput');
const masterPreview = document.getElementById('masterPreview');
const startAutomationBtn = document.getElementById('startAutomationBtn');

// Automatically render the 9 custom configuration cards on screen
for (let i = 1; i <= 9; i++) {
    const card = document.createElement('div');
    card.className = 'slot-card';
    card.innerHTML = `
        <div class="slot-title">Pose Slot #${i}</div>
        <div class="input-group">
            <label>1. Target Pose Image Reference (Optional)</label>
            <input type="file" class="pose-file-input" data-slot="${i}" accept="image/*">
            <div class="pose-preview-box" id="pose-preview-${i}">No reference image selected</div>
        </div>
        <div class="input-group">
            <label>2. Pose & Environment Prompt Instruction</label>
            <textarea class="pose-prompt-input" data-slot="${i}" rows="2" placeholder="Example: Top view, resting on white satin cloth, cinematic ambient light..."></textarea>
        </div>
        <div class="output-result-box" id="output-box-${i}">
            <span style="color:#9ca3af; font-size:0.85rem;">Resulting image will render here</span>
        </div>
    `;
    slotsContainer.appendChild(card);
}

// Handle Master Ring Image Upload
masterImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            masterImageBase64 = event.target.result.split(',')[1];
            masterPreview.innerHTML = `<img src="${event.target.result}" />`;
            checkValidationState();
        };
        reader.readAsDataURL(file);
    }
});

// Handle the individual 9 pose reference layout images
slotsContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('pose-file-input')) {
        const slotId = e.target.getAttribute('data-slot');
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewBox = document.getElementById(`pose-preview-${slotId}`);
                previewBox.innerHTML = `<img src="${event.target.result}" data-base64="${event.target.result.split(',')[1]}" />`;
            };
            reader.readAsDataURL(file);
        }
    }
});

function checkValidationState() {
    if (masterImageBase64) {
        startAutomationBtn.disabled = false;
    }
}

// Core Execution: Run the 9 Intelligent Tasks
startAutomationBtn.addEventListener('click', async () => {
    startAutomationBtn.disabled = true;
    startAutomationBtn.innerText = "AI is thinking and processing...";

    const promptInputs = document.querySelectorAll('.pose-prompt-input');
    
    const executionList = Array.from(promptInputs).map(async (textarea) => {
        const slotId = textarea.getAttribute('data-slot');
        const userPrompt = textarea.value.trim() || "Professional commercial catalog jewelry presentation shot";
        const outputBox = document.getElementById(`output-box-${slotId}`);
        
        // Find if a style reference image exists for this slot
        const uploadedPoseImgElement = document.querySelector(`#pose-preview-${slotId} img`);
        const poseImageBase64 = uploadedPoseImgElement ? uploadedPoseImgElement.getAttribute('data-base64') : null;

        outputBox.innerHTML = `<div style="color:#4f46e5; font-size:0.9rem;">AI processing slot #${slotId}...</div>`;

        try {
            // Intelligent Model: Gemini 2.5 Flash Image Preview (Multimodal Context Engine)
            // It parses the ring structure and maps it directly onto your custom prompt directions
            const resultImage = await puter.ai.txt2img(
                `A professional high-resolution image of the ring design layout provided in the master image context. Modify the scene to match this exact direction: ${userPrompt}. Maintain the item structure perfectly, pristine reflections, hyper-realistic photography.`,
                {
                    model: "gemini-2.5-flash-image-preview",
                    input_image: masterImageBase64, // The master item
                    input_image_mime_type: "image/png"
                }
            );

            // Print the rendered output cleanly to the specific UI block
            outputBox.innerHTML = `
                <img src="${resultImage.src}" />
                <a href="${resultImage.src}" download="pose-${slotId}.png" class="download-btn">Download This Pose</a>
            `;

        } catch (error) {
            console.error(error);
            outputBox.innerHTML = `<div style="color:#ef4444; font-size:0.85rem;">Error occurred. Retrying pipeline...</div>`;
        }
    });

    await Promise.all(executionList);
    startAutomationBtn.disabled = false;
    startAutomationBtn.innerText = "Run AI Thinking & Generation Engine";
});
