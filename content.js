// Detect the PDF viewer (likely an iframe or its parent container)
function getPDFViewer() {
    const iframe = document.querySelector("iframe[src*='.pdf'], embed[src*='.pdf'], object[data*='.pdf']");
    // If iframe is inside a container, target the parent for resizing
    return iframe ? (iframe.parentElement || iframe) : null;
  }
  
  // Resize function
  function resizePDF(element, width, height) {
    if (element) {
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.margin = "0 auto";
      element.style.display = "block";
    }
  }
  
  // Create floating control panel
  const pdfViewer = getPDFViewer();
  if (pdfViewer) {
    const panel = document.createElement("div");
    panel.id = "pdf-resizer-panel";
    panel.innerHTML = `
      <button onclick="adjustSize(50, 50)">+ Size</button>
      <button onclick="adjustSize(-50, -50)">- Size</button>
      <button onclick="fitToPage()">Fit to Page</button>
    `;
    document.body.appendChild(panel);
  
    // Load saved preferences
    chrome.storage.local.get(["pdfWidth", "pdfHeight"], (data) => {
      const width = data.pdfWidth || 800;
      const height = data.pdfHeight || 600;
      resizePDF(pdfViewer, width, height);
    });
  
    // Adjust size function
    window.adjustSize = (deltaWidth, deltaHeight) => {
      const currentWidth = parseInt(pdfViewer.style.width) || 800;
      const currentHeight = parseInt(pdfViewer.style.height) || 600;
      const newWidth = Math.max(300, currentWidth + deltaWidth); // Minimum size
      const newHeight = Math.max(300, currentHeight + deltaHeight);
      resizePDF(pdfViewer, newWidth, newHeight);
      chrome.storage.local.set({ pdfWidth: newWidth, pdfHeight: newHeight });
    };
  
    // Fit to page function
    window.fitToPage = () => {
      const width = window.innerWidth - 300; // Account for sidebar
      const height = window.innerHeight - 200; // Account for header/footer
      resizePDF(pdfViewer, width, height);
      chrome.storage.local.set({ pdfWidth: width, pdfHeight: height });
    };
  } else {
    console.log("No PDF viewer found on this page.");
  }