const dropzone = document.getElementById('dropzone');
const fileList = document.getElementById('fileList');
const launchModalButton = document.getElementById("open-upload-modal");
const closeModalButton = document.getElementById("modal-close-btn");

// Key val pairs of fileName:filecontent
const contextMap = {}

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = '#e0e0e0';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.backgroundColor = '#fff';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = '#fff';
    handleFiles(e.dataTransfer.files);
});

launchModalButton.addEventListener("click", () => {
    // Get display state of modal
    const uploadModal = document.getElementById("upload-modal");
    if (!uploadModal) {
        return;
    }
    uploadModal.style.display = "flex";
})

closeModalButton.addEventListener("click", () => {
    // Get display state of modal
    const uploadModal = document.getElementById("upload-modal");
    if (!uploadModal) {
        return;
    }
    uploadModal.style.display = "none";
})




function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        fileList.appendChild(listItem);

        const reader = new FileReader();
        reader.onload = async (e) => {
            if (file.type === 'text/plain') {
                console.log(`Content of ${file.name}:`, e.target.result);
            } else if (file.type === 'application/pdf') {
                const pdf = await pdfjsLib.getDocument({data: e.target.result}).promise;
                let textContent = '';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const text = await page.getTextContent();
                    textContent += text.items.map(item => item.str).join(' ');
                }
                console.log(`Content of ${file.name}:`, textContent);
                contextMap[file.name] = textContent;
            }
        };

        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else if (file.type === 'application/pdf') {
            reader.readAsArrayBuffer(file);
        }
    }
}
