const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let image = new Image();

const subtypeOptions = {
    TypeA: [
    "University",
    "Menagerie",
    "Sports",
    "Vanguard",
    "Breaking News",
    "Just In",
    "Update",
    "Halalan2025",
    "University LA Session",
    "Just In LA Session",
    "National Situationer"
    ],
    TypeB: [
    "University",
    "Menagerie",
    "Sports",
    "Vanguard",
    "Breaking News",
    "Just In",
    "Update",
    "Halalan2025"
    ],
    TypeC: [
    "Quote Visual"
    ]
};

const nbtypeDropdown = document.getElementById("dd_nbtype");
const subtypeDropdown = document.getElementById("dd_subtype");

// Populate subtypes
nbtypeDropdown.addEventListener("change", function () {
const selectedType = this.value;
subtypeDropdown.innerHTML = '<option value="" disabled selected>Select a Subtype</option>';

if (subtypeOptions[selectedType]) {
    subtypeOptions[selectedType].forEach(function (optionText) {
    const option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    if (selectedType === "TypeC") option.selected = true;
    subtypeDropdown.appendChild(option);
    });
}
});

const imgInput = document.getElementById("imgInput");
const addImageBtn = document.getElementById("addImageBtn");
const imageControlsDiv = document.getElementById("imageControls");
const textControlsDiv = document.getElementById("textControls");

nbtypeDropdown.addEventListener("change", () => {
    const selectedType = nbtypeDropdown.value;

    const shouldEnableImageControls = selectedType === "TypeB" || selectedType === "TypeC";
    const shouldEnableTextControls = selectedType === "TypeA";

    // Image controls toggle
    imgInput.disabled = !shouldEnableImageControls;
    addImageBtn.disabled = !shouldEnableImageControls;
    imageControlsDiv.style.display = shouldEnableImageControls ? "block" : "none";

    // Text controls toggle
    textControlsDiv.style.display = shouldEnableTextControls ? "block" : "none";
});

// Load image when both dropdowns are selected
nbtypeDropdown.addEventListener("change", loadTemplateImage);
subtypeDropdown.addEventListener("change", loadTemplateImage);

// Custom Alert Function
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'alert-close';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => {
        alert.classList.add('hide');
        setTimeout(() => alert.remove(), 300);
    };
    
    alert.appendChild(messageSpan);
    alert.appendChild(closeButton);
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

function addCanvasUpdateAnimation() {
    const canvas = document.getElementById('canvas');
    canvas.classList.remove('canvas-update');
    // Trigger reflow
    void canvas.offsetWidth;
    canvas.classList.add('canvas-update');
}

function loadTemplateImage() {
    const nbtype = nbtypeDropdown.value;
    const subtype = subtypeDropdown.value;

    if (nbtype && subtype) {
        const path = `Templates/${nbtype}/${subtype}.png`;
        image.src = path;

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            addCanvasUpdateAnimation();
        };

        image.onerror = () => {
            showAlert(`Image not found at path: ${path}`);
        };
    }
}

async function addImageToCanvas() {
    const file = imgInput.files[0];
    const text = document.getElementById("textInput").value;
    const credits = document.getElementById("photoCreditsInput").value;
    const nbtype = nbtypeDropdown.value;
    const subtype = subtypeDropdown.value;

    if (!subtype) {
        showAlert("Please select a Subtype before adding an image.");
        return;
    }

    if (!file) {
        showAlert("Please select an image first.");
        return;
    }

    if (text.trim() === "") {
        showAlert("Please enter a headline.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const uploadedImg = new Image();
        uploadedImg.onload = async function () {
            // Redraw the base template
            ctx.drawImage(image, 0, 0, 1080, 1080);

            const targetWidth = 1080;
            const targetHeight = 580;

            const imgWidth = uploadedImg.width;
            const imgHeight = uploadedImg.height;

            const imgAspect = imgWidth / imgHeight;
            const targetAspect = targetWidth / targetHeight;

            let sourceX, sourceY, sourceWidth, sourceHeight;

            if (imgAspect > targetAspect) {
                sourceHeight = imgHeight;
                sourceWidth = imgHeight * targetAspect;
                sourceX = (imgWidth - sourceWidth) / 2;
                sourceY = 0;
            } else {
                sourceWidth = imgWidth;
                sourceHeight = imgWidth / targetAspect;
                sourceX = 0;
                sourceY = (imgHeight - sourceHeight) / 2;
            }

            // Draw the cropped image
            ctx.drawImage(
                uploadedImg,
                sourceX, sourceY, sourceWidth, sourceHeight,
                0, 0, targetWidth, targetHeight
            );

            // Load font and draw text
            await document.fonts.load("63pt 'HexFranklin'");
            drawHeadlineText(nbtype, subtype, text);

            // Draw photo credits
            if (credits.trim() !== "") {
                ctx.font = "20pt 'HexFranklin'";
                ctx.fillStyle = "white";
                ctx.textAlign = "left";
                ctx.fillText(`Photo Credits: ${credits}`, 20, 560);
            }

            addCanvasUpdateAnimation();
        };
        uploadedImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function drawHeadlineText(nbtype, subtype, text) {
    if (!nbtype || !text.trim()) return;
    if (!subtype || !text.trim()) return;

    let yStartVal, linesVal, currentLineVal, currentLineMaxVal;

    if (nbtype === "TypeA" && ["University", "Menagerie", "Sports", "Vanguard", "Halalan2025", "University LA Session", "Just In LA Session", "National Situationer"].includes(subtype)) { // Type A Batch 1
        yStartVal = 800;
        linesVal = ["", ""];
        currentLineVal = 1;
        currentLineMaxVal = 2;
    } else if (nbtype === "TypeA" && ["Breaking News", "Just In", "Update"].includes(subtype)) { // Type A Batch 2
        yStartVal = 715;
        linesVal = ["", "", ""];
        currentLineVal = 2;
        currentLineMaxVal = 3;
    } else if (nbtype === "TypeB" && ["University", "Menagerie", "Sports", "Vanguard", "Breaking News", "Just In", "Update", "Halalan2025"].includes(subtype)) { // Type B
        yStartVal = 830;
        linesVal = ["", ""];
        currentLineVal = 1;
        currentLineMaxVal = 2;
    } else {
        showAlert("Invalid combination of NB Type and Subtype.");
    }

    const fontSize = 63;
    const lineHeight = 95;
    const maxWidth = 1080 - 140; // margin
    const xCenter = 540;

    ctx.font = `${fontSize}pt 'HexFranklin'`;
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";

    const words = text.split(" ");
    let currentLine = 0;

    for (let i = 0; i < words.length; i++) {
        const testLine = linesVal[currentLine] + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth) {
            currentLine++;
        }

        if (currentLine < currentLineMaxVal) {
            linesVal[currentLine] += words[i] + " ";
        } else {
            showAlert("Text is too long. Please shorten it.");
        }
    }

    for (let i = 0; i < currentLineMaxVal; i++) {
        linesVal[i] = linesVal[i].trim();
        if (linesVal[i]) {
            ctx.fillText(linesVal[i], xCenter, yStartVal + (i * lineHeight));
        }
    }
}

// For Type A only -- prompted by "Add Text" button"
async function drawText() {
    const text = document.getElementById("textInput").value;
    const nbtype = nbtypeDropdown.value;
    const subtype = subtypeDropdown.value;

    if (!subtype) {
        showAlert("Please select a Subtype before adding text.");
        return;
    }

    if (text.trim() === "") {
        showAlert("Please enter a headline.");
        return;
    }

    await document.fonts.load("63pt 'HexFranklin'");
    ctx.drawImage(image, 0, 0, 1080, 1080);
    drawHeadlineText(nbtype, subtype, text);
    addCanvasUpdateAnimation();
}

// Export canvas as an image
function exportCanvas() {
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

const tempBg = new Image();
    tempBg.src = "image.png";

    tempBg.onload = () => {
        ctx.drawImage(tempBg, 0, 0, canvas.width, canvas.height);
    };