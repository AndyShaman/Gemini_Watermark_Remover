/**
 * Main Application
 * Orchestrates the entire watermark removal process with manual mask drawing
 */

import { CONFIG } from './config.js';
import { validateImageFile, loadImageFromFile, createLogger, formatFileSize } from './utils.js';
import { modelManager } from './model-manager.js';
import { preprocessImageWithMask, postprocessImage, composeFinalImageWithMask, resizeImageForModel } from './image-processor.js';
import { UIManager } from './ui-manager.js';
import { MaskEditor } from './mask-editor.js';

/**
 * Application class
 */
class Application {
  constructor() {
    this.logger = null;
    this.uiManager = null;
    this.maskEditor = null;
    this.currentImageBitmap = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    // Get DOM elements
    const elements = {
      dropZone: document.getElementById('dropZone'),
      fileInput: document.getElementById('fileInput'),
      progressContainer: document.getElementById('progressContainer'),
      progressBar: document.getElementById('progressBar'),
      progressText: document.getElementById('progressText'),
      resultArea: document.getElementById('resultArea'),
      previewImg: document.getElementById('previewImg'),
      downloadLink: document.getElementById('downloadLink'),
      resetBtn: document.getElementById('resetBtn'),
      logArea: document.getElementById('logArea'),
      comparisonContainer: document.getElementById('comparisonContainer'),
      // Mask editor elements
      maskEditorSection: document.getElementById('maskEditorSection'),
      maskEditorContainer: document.getElementById('maskEditorContainer'),
      brushTool: document.getElementById('brushTool'),
      eraserTool: document.getElementById('eraserTool'),
      brushSize: document.getElementById('brushSize'),
      brushSizeValue: document.getElementById('brushSizeValue'),
      clearMask: document.getElementById('clearMask'),
      processBtn: document.getElementById('processBtn'),
      cancelEditBtn: document.getElementById('cancelEditBtn'),
      handTool: document.getElementById('handTool'),
      // Zoom elements
      zoomIn: document.getElementById('zoomIn'),
      zoomOut: document.getElementById('zoomOut'),
      zoomFit: document.getElementById('zoomFit'),
      zoomValue: document.getElementById('zoomValue')
    };

    // Initialize logger
    this.logger = createLogger(elements.logArea);
    this.logger.info('Application initialized');

    // Initialize UI manager
    this.uiManager = new UIManager(elements, this.logger);

    // Setup event handlers
    this.uiManager.setupDragAndDrop((file) => this.handleFileSelection(file));
    this.uiManager.setupResetButton(() => this.handleReset());

    // Setup mask editor toolbar
    this.setupMaskEditorToolbar(elements);

    this.logger.info('Ready to process images');
  }

  /**
   * Setup mask editor toolbar event handlers
   * @param {Object} elements - DOM elements
   */
  setupMaskEditorToolbar(elements) {
    // Brush tool
    elements.brushTool.addEventListener('click', () => {
      elements.brushTool.classList.add('active');
      elements.eraserTool.classList.remove('active');
      elements.handTool.classList.remove('active');
      if (this.maskEditor) {
        this.maskEditor.setTool('brush');
      }
    });

    // Eraser tool
    elements.eraserTool.addEventListener('click', () => {
      elements.eraserTool.classList.add('active');
      elements.brushTool.classList.remove('active');
      elements.handTool.classList.remove('active');
      if (this.maskEditor) {
        this.maskEditor.setTool('eraser');
      }
    });

    // Hand tool
    elements.handTool.addEventListener('click', () => {
      elements.handTool.classList.add('active');
      elements.brushTool.classList.remove('active');
      elements.eraserTool.classList.remove('active');
      if (this.maskEditor) {
        this.maskEditor.setTool('hand');
      }
    });

    // Brush size slider
    elements.brushSize.addEventListener('input', (e) => {
      const size = parseInt(e.target.value, 10);
      elements.brushSizeValue.textContent = size;
      if (this.maskEditor) {
        this.maskEditor.setBrushSize(size);
      }
    });

    // Clear mask button
    elements.clearMask.addEventListener('click', () => {
      if (this.maskEditor) {
        this.maskEditor.clearMask();
        elements.processBtn.disabled = true;
      }
    });

    // Process button
    elements.processBtn.addEventListener('click', () => {
      this.processWithMask();
    });

    // Cancel button
    elements.cancelEditBtn.addEventListener('click', () => {
      this.handleReset();
    });

    // Zoom controls
    elements.zoomIn.addEventListener('click', () => {
      if (this.maskEditor) {
        this.maskEditor.zoomIn();
      }
    });

    elements.zoomOut.addEventListener('click', () => {
      if (this.maskEditor) {
        this.maskEditor.zoomOut();
      }
    });

    elements.zoomFit.addEventListener('click', () => {
      if (this.maskEditor) {
        this.maskEditor.resetZoom();
      }
    });
  }

  /**
   * Handle file selection
   * @param {File} file - Selected file
   */
  async handleFileSelection(file) {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      this.uiManager.showError(validation.error);
      return;
    }

    this.logger.info(`File selected: ${file.name} (${formatFileSize(file.size)})`);

    try {
      // Load image
      const imageBitmap = await loadImageFromFile(file);
      this.currentImageBitmap = imageBitmap;

      this.logger.info(`Image loaded: ${imageBitmap.width}x${imageBitmap.height}px`);

      // Show mask editor
      this.showMaskEditor(imageBitmap);
    } catch (error) {
      this.logger.error(`Failed to load image: ${error.message}`);
      this.uiManager.showError(`Failed to load image: ${error.message}`);
    }
  }

  /**
   * Show mask editor with loaded image
   * @param {ImageBitmap} imageBitmap - The loaded image
   */
  showMaskEditor(imageBitmap) {
    const container = document.getElementById('maskEditorContainer');
    const section = document.getElementById('maskEditorSection');
    const dropZone = document.getElementById('dropZone');
    const processBtn = document.getElementById('processBtn');
    const brushSize = document.getElementById('brushSize');

    // Hide drop zone, show editor
    dropZone.style.display = 'none';
    section.style.display = 'block';

    // Initialize mask editor with brush size from slider
    const currentBrushSize = parseInt(brushSize.value, 10);
    this.maskEditor = new MaskEditor(container, {
      brushSize: currentBrushSize,
      maskColor: 'rgba(255, 0, 0, 0.5)' // Red semi-transparent
    });

    this.maskEditor.init(imageBitmap);

    // Enable process button when mask has content
    this.maskEditor.onMaskChange = () => {
      processBtn.disabled = !this.maskEditor.hasMask();
    };

    // Update zoom display
    const zoomValue = document.getElementById('zoomValue');
    this.maskEditor.onZoomChange = (zoom) => {
      zoomValue.textContent = `${Math.round(zoom * 100)}%`;
    };

    this.logger.info('Draw over the watermark area, then click "Remove Watermark"');
    this.logger.info('Use mouse wheel to zoom, scroll to pan');
  }

  /**
   * Process image with user-drawn mask
   */
  async processWithMask() {
    if (!this.maskEditor || !this.maskEditor.hasMask()) {
      this.uiManager.showError('Please draw a mask over the watermark area first');
      return;
    }

    const section = document.getElementById('maskEditorSection');

    // Hide editor, show progress
    section.style.display = 'none';
    this.uiManager.setProcessing();

    try {
      await this.processImage();
    } catch (error) {
      this.logger.error(`Processing failed: ${error.message}`);
      this.uiManager.showError(`${CONFIG.ERRORS.PROCESSING_FAILED}: ${error.message}`);
      this.uiManager.reset();
    }
  }

  /**
   * Process image through the entire pipeline with custom mask
   */
  async processImage() {
    // Step 1: Get mask
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.FILE_READ,
      'Preparing mask...'
    );

    const maskImageData = this.maskEditor.getMaskForModel();

    // Step 2: Initialize model
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.MODEL_CHECK,
      'Checking AI model...'
    );

    await modelManager.initialize((percent, bytes) => {
      if (bytes !== null) {
        this.uiManager.updateProgress(
          percent,
          `Downloading model (${formatFileSize(bytes)})...`
        );
      } else {
        this.uiManager.updateProgress(
          percent,
          'Initializing neural engine...'
        );
      }
    });

    // Step 3: Prepare input
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.PREPROCESSING,
      'Preparing image for AI processing...'
    );

    const resizedImageData = resizeImageForModel(this.currentImageBitmap);
    const { imageTensor, maskTensor } = preprocessImageWithMask(resizedImageData, maskImageData);

    this.logger.info(`Preprocessed to ${CONFIG.MODEL.INPUT_SIZE}x${CONFIG.MODEL.INPUT_SIZE}px`);

    // Step 4: Run inference
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.INFERENCE,
      'Removing watermark with AI...'
    );

    // Small delay to allow UI update
    await new Promise(resolve => setTimeout(resolve, 100));

    const outputTensor = await modelManager.runInference({
      image: imageTensor,
      mask: maskTensor
    });

    this.logger.info('AI processing complete');

    // Step 5: Postprocess
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.POSTPROCESSING,
      'Composing final high-resolution image...'
    );

    const processedImageData = postprocessImage(
      outputTensor,
      CONFIG.MODEL.INPUT_SIZE,
      CONFIG.MODEL.INPUT_SIZE
    );

    // Step 6: Compose final image with mask
    const finalDataUrl = composeFinalImageWithMask(
      this.currentImageBitmap,
      processedImageData,
      maskImageData
    );

    this.logger.info('Final image composed at original resolution');

    // Step 7: Show result
    this.uiManager.updateProgress(
      CONFIG.UI.PROGRESS_STEPS.COMPLETE,
      'Complete!'
    );

    // Create original data URL for comparison
    const originalCanvas = document.createElement('canvas');
    originalCanvas.width = this.currentImageBitmap.width;
    originalCanvas.height = this.currentImageBitmap.height;
    const ctx = originalCanvas.getContext('2d');
    ctx.drawImage(this.currentImageBitmap, 0, 0);
    const originalDataUrl = originalCanvas.toDataURL('image/png');

    this.uiManager.showResult(finalDataUrl, originalDataUrl);
  }

  /**
   * Handle reset action
   */
  handleReset() {
    // Destroy mask editor
    if (this.maskEditor) {
      this.maskEditor.destroy();
      this.maskEditor = null;
    }

    // Reset UI elements
    const section = document.getElementById('maskEditorSection');
    const processBtn = document.getElementById('processBtn');
    const brushTool = document.getElementById('brushTool');
    const eraserTool = document.getElementById('eraserTool');
    const handTool = document.getElementById('handTool');

    section.style.display = 'none';
    processBtn.disabled = true;
    brushTool.classList.add('active');
    eraserTool.classList.remove('active');
    handTool.classList.remove('active');

    this.currentImageBitmap = null;
    this.logger.info('Reset - Ready for new image');
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();
  });
} else {
  const app = new Application();
  app.init();
}
