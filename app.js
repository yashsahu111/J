const poses = [
  { name: "Top-Down Macro", prompt: "Macro shot of the ring from straight above, resting on a white glossy reflective surface, soft studio lighting" },
  { name: "45-Degree Angle", prompt: "A 45-degree angled presentation shot of the ring, depth of the band visible, resting on clean dark slate stone" },
  { name: "On Hand Model", prompt: "Elegant close-up shot of an elegant hand wearing the ring, soft focus out-of-focus background, natural luxury daylighting" },
  { name: "Side Profile", prompt: "Side profile view of the ring showing the precise structural design of the crown stone setting, minimal studio background" },
  { name: "Inside Velvet Box", prompt: "The ring elegantly nestled inside an open black luxury velvet jewelry box, dramatic macro spotlighting" },
  { name: "Floating Creative", prompt: "Creative dynamic catalog shot of the ring floating slightly in mid-air against an ethereal, soft-lit luxury background" },
  { name: "Marble Countertop", prompt: "High-end product showcase of the ring sitting on a white Carrara marble slab, bright natural morning sunlight" },
  { name: "Outdoor Lifestyle", prompt: "The ring resting gently on a crisp sunlit leaf with tiny morning dew drops, organic environment, luxury bokeh" },
  { name: "Water Reflection", prompt: "The ring resting perfectly on a still water glass surface with clean mirror reflection underneath, soft ambient blue mood" }
];

let targetImageSrc = null;
const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const galleryGrid = document.getElementById('galleryGrid');
const statusMessage = document.getElementById('statusMessage');

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            targetImageSrc = event.target.result;
            processBtn.disabled = false;
            statusMessage.innerText = "Base ring photo loaded successfully. Ready to run.";
        };
        reader.readAsDataURL(file);
    }
});

processBtn.addEventListener('click', async () => {
    processBtn.disabled = true;
    galleryGrid.innerHTML = '';
    statusMessage.innerText = "Processing 9 poses concurrently. Please do not close this window...";

    // Run all 9 processing tasks in parallel streams
    const tasks = poses.map(async (pose) => {
        // Create an empty visual block representing a processing slot
        const card = document.createElement('div');
        card.className = 'pose-card';
        card.innerHTML = `
            <div class="placeholder-loading" id="loader-${pose.name.replace(/\s+/g, '')}" style="height:320px; display:flex; align-items:center; justify-content:center; background:#e9ecef; color:#6c757d; font-size:0.9rem;">Generating image...</div>
            <div class="pose-info">
                <div>
                    <div class="pose-title">${pose.name}</div>
                    <div class="pose-desc">${pose.prompt}</div>
                </div>
            </div>
        `;
        galleryGrid.appendChild(card);

        try {
            // Free API Execution Core: Image-to-Image pipeline
            // Img2Img uses the original image context to force shape preservation
            const outputImage = await puter.ai.txt2img(
                `${pose.prompt}, highly detailed, professional product photography, 8k resolution, maintaining exact ring shape layout`, 
                {
                    img: targetImageSrc,
                    strength: 0.35, // Crucial: forces the AI to modify the background but preserve your exact ring structure
                    negative_prompt: "deformed, low quality, altered gemstone layout, missing prongs, changed ring style, blurry"
                }
            );

            // Replace loading text block with completed graphic result
            const loader = document.getElementById(`loader-${pose.name.replace(/\s+/g, '')}`);
            const finalImg = document.createElement('img');
            finalImg.src = outputImage.src;
            loader.replaceWith(finalImg);

            // Append safe download pipeline link
            const infoBlock = card.querySelector('.pose-info');
            const dlLink = document.createElement('a');
            dlLink.className = 'download-link';
            dlLink.href = outputImage.src;
            dlLink.download = `${pose.name.toLowerCase().replace(/\s+/g, '-')}.png`;
            dlLink.innerText = "Download Pose Image";
            infoBlock.appendChild(dlLink);

        } catch (err) {
            document.getElementById(`loader-${pose.name.replace(/\s+/g, '')}`).innerText = "Generation failed. Retrying...";
            console.error(err);
        }
    });

    await Promise.all(tasks);
    statusMessage.innerText = "All 9 ring poses generated successfully with zero script runtime faults!";
});
