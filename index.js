const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let image = new Image();

const subtypeOptions = {
    TypeA: [
    "University",
    "Atlas",
    "Menagerie",
    "Sports",
    "Vanguard",
    "Breaking News",
    "Just In",
    "Update",
    "University LA Session",
    "Just In LA Session",
    "National Situationer"
    ],
    TypeB: [
    "University",
    "Atlas",
    "Menagerie",
    "Sports",
    "Vanguard",
    "Breaking News",
    "Just In",
    "Update",
    ],
    TypeC: [
    "Quote Visual"
    ]
};

const credsposOptions = {
    TypeB: [
        "Top Left",
        "Top Right",
        "Bottom Left",
        "Bottom Right"
                ],
    TypeC: [
        "Top Right",
        "Bottom Right"
    ]
}

const nbtypeDropdown = document.getElementById("dd_nbtype");
const subtypeDropdown = document.getElementById("dd_subtype");
const credsposDropdown = document.getElementById("dd_credspos");
const credscolorDropdown = document.getElementById("dd_credscolor");
const credsoptionDropdown = document.getElementById("dd_credsoption");

// Populate subtypes
nbtypeDropdown.addEventListener("change", function () {
const selectedType = this.value;
subtypeDropdown.innerHTML = '<option value="" disabled selected>Select Subtype</option>';

if (subtypeOptions[selectedType]) {
    subtypeOptions[selectedType].forEach(function (optionText) {
    const option = document.createElement("option");
    option.value = optionText;
    option.text = optionText;
    if (selectedType === "TypeC") option.selected = true;
    subtypeDropdown.appendChild(option);
    });
}

// Populate photo courtesy position
credsposDropdown.innerHTML = '<option value="" disabled selected>Select Position</option>';

if (credsposOptions[selectedType]) {
        credsposOptions[selectedType].forEach(function (optionText) {
            const option = document.createElement("option");
            option.value = optionText;
            option.text = optionText;
            credsposDropdown.appendChild(option);
        });
    }

});

const imgInput = document.getElementById("imgInput");
const addImageBtn = document.getElementById("addImageBtn");
const imageControlsDiv = document.getElementById("imageControls");
const textControlsDiv = document.getElementById("textControls");
const typeABFields = document.getElementById("typeABFields");
const exportBtn = document.getElementById("exportBtn");
const typeCFields = document.getElementById("typeCFields");
const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const charCountTypeC = document.getElementById("charCountTypeC");

// Disable image controls by default
nbtypeDropdown.addEventListener("change", () => {
    const selectedType = nbtypeDropdown.value;

    const shouldEnableImageControls = selectedType === "TypeB" || selectedType === "TypeC";
    const shouldEnableTextControls = selectedType === "TypeA";
    const shouldEnableExportBtn = selectedType != "";
    const shouldShowTypeCFields = selectedType === "TypeC";

    // Export button toggle
    exportBtn.style.display = shouldEnableExportBtn ? "block" : "none";

    // Image controls toggle
    imgInput.disabled = !shouldEnableImageControls;
    addImageBtn.disabled = !shouldEnableImageControls;
    imageControlsDiv.style.display = shouldEnableImageControls ? "block" : "none";

    // Text controls toggle
    textControlsDiv.style.display = shouldEnableTextControls ? "block" : "none";

    // Type C Fields toggle
    typeCFields.style.display = shouldShowTypeCFields ? "block" : "none";
    typeABFields.style.display = shouldShowTypeCFields ? "none" : "block";

    charCount.textContent = `Character Count:`;
    charCountTypeC.textContent = `Character Count:`;
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
    closeButton.innerHTML = 'x';
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
    let text;
    let inputValue;
    let count;
    const courtesy = document.getElementById("photoCourtesyInput").value;
    const nbtype = nbtypeDropdown.value;
    const subtype = subtypeDropdown.value;
    const credspos = credsposDropdown.value;
    const credscolor = credscolorDropdown.value
    const credsoption = credsoptionDropdown.value;

    if (nbtype === "TypeC") {
        text = document.getElementById("quoteInput").value;
        inputValue = text.trim().replace(/\s+/g, " "); // Trim and normalize spaces
        count = inputValue.length;
        charCountTypeC.textContent = `Character Count: ${count}`;
    } else {
        text = document.getElementById("textInput").value;
        inputValue = text.trim().replace(/\s+/g, " "); // Trim and normalize spaces
        count = inputValue.length;
        charCount.textContent = `Character Count: ${count}`;
    }

    if (!subtype) {
        showAlert("Please select a Subtype before adding an image.");
        return;
    }

    if (courtesy != "" && !credspos && !credscolor && !credsoption) {
        showAlert("Please select position, color, and type of Courtesy.");
        return;
    }

    if (courtesy != "" && !credsoption) {
        showAlert("Please select type of the Courtesy.");
        return;
    }

    if (courtesy != "" && !credspos) {
        showAlert("Please select position of the Courtesy.");
        return;
    }

    if (courtesy != "" && !credscolor) {
        showAlert("Please select color of the Courtesy.");
        return;
    }

    if (!file) {
        showAlert("Please select an image first.");
        return;
    }

    if (text.trim() === "") {
        if(nbtype === "TypeC") {
            showAlert("Please enter a quote.");
        } else {
            showAlert("Please enter a headline.");
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const uploadedImg = new Image();
        uploadedImg.onload = async function () {
            // Redraw the base template
            ctx.drawImage(image, 0, 0, 1080, 1080);

            let targetWidth, targetHeight;
            
            if (nbtype === "TypeC") {
                targetWidth = 460;
                targetHeight = 1080;
            } else {
                targetWidth = 1080;
                targetHeight = 580;
            }

            // For Type C only
            const destX = 1080 - targetWidth; // Right side of canvas
            const destY = 0;

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
            if(nbtype === "TypeC") {
                ctx.drawImage(
                    uploadedImg,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    destX, destY, targetWidth, targetHeight
                );
            } else {
                ctx.drawImage(
                    uploadedImg,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    0, 0, targetWidth, targetHeight
                );
            }

            // Load font and draw text
            await document.fonts.load("63pt 'HexFranklin'");
            if (nbtype === "TypeC"){
                drawQuoteText(text);
                drawTypeCSubtext();
            } else {
                drawHeadlineText(nbtype, subtype, text);
            }

            const credspos = credsposDropdown.value;
            const credscolor = credscolorDropdown.value;
            const credsoption = credsoptionDropdown.value;

            // Draw courtesy
            if (courtesy.trim() !== "") {
                ctx.font = "20pt 'HexFranklin'";
                ctx.fillStyle = credscolor;
                if (nbtype === "TypeC") {
                    ctx.textAlign = "right";
                    if (credsoption === "staffer") {
                        credsLength = 'Photo by '.length + courtesy.length;
                        if (credspos === "Top Right") {
                            ctx.fillText(`Photo by ${courtesy}`, 1080 - credsLength, 40);
                        } else if (credspos === "Bottom Right") {
                            ctx.fillText(`Photo by ${courtesy}`, 1080 - credsLength, 1060);
                        }
                    }
                    else { // borrowed
                        credsLength = 'Courtesy: '.length + courtesy.length;
                        if (credspos === "Top Right") {
                            ctx.fillText(`Courtesy: ${courtesy}`, 1080 - credsLength, 40);
                        } else if (credspos === "Bottom Right") {
                            ctx.fillText(`Courtesy: ${courtesy}`, 1080 - credsLength, 1060);
                        }
                    }
                    
                } else { // Type B
                    if (credsoption === "staffer") {
                        if (credspos === "Bottom Left") {
                        ctx.textAlign = "left";
                        ctx.fillText(`Photo by ${courtesy}`, 20, 560);
                        } else if (credspos === "Bottom Right") {
                            ctx.textAlign = "right";
                            credsLength = 'Photo by '.length + courtesy.length;
                            ctx.fillText(`Photo by ${courtesy}`, 1080 - credsLength, 560);
                        } else if (credspos === "Top Left") {
                            ctx.textAlign = "left";
                            ctx.fillText(`Photo by ${courtesy}`, 20, 40);
                        } else if (credspos === "Top Right") {
                            ctx.textAlign = "right";
                            credsLength = 'Photo by '.length + courtesy.length;
                            ctx.fillText(`Photo by ${courtesy}`, 1080 - credsLength, 40);
                        }
                    }
                    else { // borrowed
                       if (credspos === "Bottom Left") {
                        ctx.textAlign = "left";
                        ctx.fillText(`Courtesy: ${courtesy}`, 20, 560);
                        } else if (credspos === "Bottom Right") {
                            ctx.textAlign = "right";
                            credsLength = 'Courtesy: '.length + courtesy.length;
                            ctx.fillText(`Courtesy: ${courtesy}`, 1080 - credsLength, 560);
                        } else if (credspos === "Top Left") {
                            ctx.textAlign = "left";
                            ctx.fillText(`Courtesy: ${courtesy}`, 20, 40);
                        } else if (credspos === "Top Right") {
                            ctx.textAlign = "right";
                            credsLength = 'Courtesy: '.length + courtesy.length;
                            ctx.fillText(`Courtesy: ${courtesy}`, 1080 - credsLength, 40);
                        } 
                    }
                }
            }

            addCanvasUpdateAnimation();
        };
        uploadedImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function formatQuote(text) {
  // Remove all quotation marks and trim whitespace
  text = text.trim().replace(/^[“"']+|[”"']+$/g, '');

  // Ensure the sentence ends with a punctuation mark
  if (text && !/[.!?]$/.test(text)) {
    text += '.';
  }

  // Wrap with standardized quotation
  return `“${text}”`;
}


function drawQuoteText(text) {
    // Add quotation marks if missing
    text = formatQuote(text);

    const charCount = text.length;
    let fontSize;
    let y = 163

    if (charCount <= 73) {
        fontSize = 75;
        y+=97;
    } else if (charCount <= 83) {
        fontSize = 65;
        y+=85;
    } else if (charCount <= 93) {
        fontSize = 60;
        y+=75;
    } else if (charCount <= 111) {
        fontSize = 55;
        y+=70;
    } else if (charCount <= 127) {
        fontSize = 52;
        y+=68;
    } else if (charCount <= 168) {
        fontSize = 50;
        y+=65;
    } else if (charCount <= 193) {
        fontSize = 45;
        y+=55;
    } else if (charCount <= 238) {
        fontSize = 42;
        y+=53;
    } else if (charCount <= 268) {
        fontSize = 40;
        y+=51;
    } else if (charCount <= 302) {
        fontSize = 38;
        y+=48;
    } else if (charCount <= 352) {
        fontSize = 35;
        y+=45;
    } else {
        showAlert("Quote is too long. Please shorten it.");
        return;
    }

    const x = 43;
    const maxWidth = 535;
    const lineHeight = fontSize * 1.45;

    ctx.font = `${fontSize}pt 'HexFranklin'`;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    if (line) {
        ctx.fillText(line.trim(), x, y);
    }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function drawTypeCSubtext() {
    let position = document.getElementById("positionInput").value;
    let name = document.getElementById("nameInput").value;
    let context = document.getElementById("contextInput").value;

    // Apply casing transformations
    name = toTitleCase(name);
    context = context.toUpperCase();

    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    // Draw position
    ctx.font = "24pt 'HexFranklin'";
    ctx.fillText(position, 44, 856);

    // Draw name
    ctx.font = "57pt 'HexFranklin'";
    ctx.fillText(name, 44, 927);

    // Draw context
    ctx.font = "normal 21pt 'HexFranklin'";
    ctx.fillText(context, 44, 970);
}

function drawHeadlineText(nbtype, subtype, text) {
    if (!nbtype || !text.trim()) return;
    if (!subtype || !text.trim()) return;

    let yStartVal, linesVal, currentLineMaxVal;

    if (nbtype === "TypeA" && ["University", "Atlas", "Menagerie", "Sports", "Vanguard", "University LA Session", "Just In LA Session", "National Situationer"].includes(subtype)) { // Type A Batch 1
        yStartVal = 800;
        linesVal = ["", ""];
        currentLineMaxVal = 2;
    } else if (nbtype === "TypeA" && ["Breaking News", "Just In", "Update"].includes(subtype)) { // Type A Batch 2
        yStartVal = 715;
        linesVal = ["", "", ""];
        currentLineMaxVal = 3;
    } else if (nbtype === "TypeB" && ["University", "Atlas", "Menagerie", "Sports", "Vanguard", "Breaking News", "Just In", "Update"].includes(subtype)) { // Type B
        yStartVal = 830;
        linesVal = ["", ""];
        currentLineMaxVal = 2;
    } else if (nbtype === "TypeC" && ["Quote Visual"].includes(subtype)) { // Type C
        yStartVal = 800;
        linesVal = ["", "", ""];
        currentLineMaxVal = 3;
    } else {
        showAlert("Invalid combination of NB Type and Subtype.");
    }

    const lineHeight = 95;
    const maxWidth = 1080 - 140; // margin
    const xCenter = 540;

    ctx.font = `63pt 'HexFranklin'`;
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";

    const words = text.split(" ");
    let currentLine = 0;
    let alertShown = false;

    for (let i = 0; i < words.length; i++) {
        const testLine = linesVal[currentLine] + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth) {
            currentLine++;
        }

        if (currentLine < currentLineMaxVal) {
            linesVal[currentLine] += words[i] + " ";
        } else if (!alertShown) {
            // Show alert only once
            showAlert("Text is too long. Please shorten it.");
            alertShown = true;
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

    const inputValue = text.trim().replace(/\s+/g, " "); // Trim and normalize spaces
    const count = inputValue.length;
    charCount.textContent = `Character Count: ${count}`;

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

async function checkPassword() {
    const pwd = document.getElementById("passwordInput").value;
    const correctPassword = "liverayinourhearts";

    if (pwd === correctPassword) {
        document.getElementById("passwordModal").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    } else {
        showAlert("Incorrect password. Please try again.");
    }
}