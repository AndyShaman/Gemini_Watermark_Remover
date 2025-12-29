/**
 * Mask Editor Module
 * Provides canvas-based drawing tools for creating watermark masks
 * With zoom support and custom circular cursor
 */

import { CONFIG } from './config.js';

/**
 * MaskEditor class - handles drawing brush/eraser on canvas
 */
export class MaskEditor {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      brushSize: options.brushSize || 110,
      minBrushSize: options.minBrushSize || 5,
      maxBrushSize: options.maxBrushSize || 200,
      maskColor: options.maskColor || 'rgba(255, 0, 0, 0.5)', // Red semi-transparent
      minZoom: options.minZoom || 0.25,
      maxZoom: options.maxZoom || 4,
      zoomStep: options.zoomStep || 0.25,
      ...options
    };

    // State
    this.currentTool = 'brush'; // 'brush', 'eraser', or 'hand'
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.imageBitmap = null;

    // Zoom and pan state
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.lastPanX = 0;
    this.lastPanY = 0;

    // Canvas elements
    this.imageCanvas = null;
    this.maskCanvas = null;
    this.cursorCanvas = null;
    this.imageCtx = null;
    this.maskCtx = null;
    this.cursorCtx = null;
    this.wrapper = null;
    this.scrollContainer = null;

    // Callbacks
    this.onMaskChange = null;
    this.onZoomChange = null;

    // Bound event handlers (for removal)
    this.boundHandlers = {};
  }

  /**
   * Initialize the editor with an image
   * @param {ImageBitmap} imageBitmap - The image to edit
   */
  init(imageBitmap) {
    this.imageBitmap = imageBitmap;
    this.createCanvases();
    this.setupEventListeners();
    this.drawImage();
    this.fitToContainer();
  }

  /**
   * Create canvas elements
   */
  createCanvases() {
    // Clear container
    this.container.innerHTML = '';

    // Create scroll container for pan
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.className = 'mask-editor-scroll-container';

    // Create wrapper for canvases
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'mask-editor-canvas-wrapper';

    // Create image canvas (bottom layer)
    this.imageCanvas = document.createElement('canvas');
    this.imageCanvas.width = this.imageBitmap.width;
    this.imageCanvas.height = this.imageBitmap.height;
    this.imageCanvas.className = 'mask-editor-image-canvas';
    this.imageCtx = this.imageCanvas.getContext('2d');

    // Create mask canvas (middle layer - for drawing)
    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = this.imageBitmap.width;
    this.maskCanvas.height = this.imageBitmap.height;
    this.maskCanvas.className = 'mask-editor-mask-canvas';
    this.maskCtx = this.maskCanvas.getContext('2d');

    // Create cursor canvas (top layer - for custom cursor)
    this.cursorCanvas = document.createElement('canvas');
    this.cursorCanvas.width = this.imageBitmap.width;
    this.cursorCanvas.height = this.imageBitmap.height;
    this.cursorCanvas.className = 'mask-editor-cursor-canvas';
    this.cursorCtx = this.cursorCanvas.getContext('2d');

    // Add canvases to wrapper
    this.wrapper.appendChild(this.imageCanvas);
    this.wrapper.appendChild(this.maskCanvas);
    this.wrapper.appendChild(this.cursorCanvas);

    // Add wrapper to scroll container
    this.scrollContainer.appendChild(this.wrapper);

    // Add scroll container to main container
    this.container.appendChild(this.scrollContainer);

    // Initial scale
    this.baseScale = 1;
    this.updateCanvasTransform();
  }

  /**
   * Fit image to container
   */
  fitToContainer() {
    const containerWidth = this.scrollContainer.clientWidth || 800;
    const containerHeight = this.scrollContainer.clientHeight || 500;

    const scaleX = containerWidth / this.imageBitmap.width;
    const scaleY = containerHeight / this.imageBitmap.height;

    this.baseScale = Math.min(scaleX, scaleY, 1);
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;

    this.updateCanvasTransform();

    if (this.onZoomChange) {
      this.onZoomChange(this.zoom);
    }
  }

  /**
   * Update canvas transform based on zoom and pan
   */
  updateCanvasTransform() {
    const scale = this.baseScale * this.zoom;
    const width = this.imageBitmap.width * scale;
    const height = this.imageBitmap.height * scale;

    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;

    // Apply transform to all canvases
    const canvases = [this.imageCanvas, this.maskCanvas, this.cursorCanvas];
    canvases.forEach(canvas => {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    });

    // Store current scale for coordinate conversion
    this.currentScale = scale;
  }

  /**
   * Draw the image on canvas
   */
  drawImage() {
    this.imageCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    this.imageCtx.drawImage(this.imageBitmap, 0, 0);
  }

  /**
   * Setup mouse/touch event listeners
   */
  setupEventListeners() {
    // Mouse events on cursor canvas (top layer)
    this.boundHandlers.mousedown = (e) => this.handleMouseDown(e);
    this.boundHandlers.mousemove = (e) => this.handleMouseMove(e);
    this.boundHandlers.mouseup = () => this.handleMouseUp();
    this.boundHandlers.mouseleave = () => this.handleMouseLeave();
    this.boundHandlers.wheel = (e) => this.handleWheel(e);

    this.cursorCanvas.addEventListener('mousedown', this.boundHandlers.mousedown);
    this.cursorCanvas.addEventListener('mousemove', this.boundHandlers.mousemove);
    this.cursorCanvas.addEventListener('mouseup', this.boundHandlers.mouseup);
    this.cursorCanvas.addEventListener('mouseleave', this.boundHandlers.mouseleave);
    this.cursorCanvas.addEventListener('wheel', this.boundHandlers.wheel, { passive: false });

    // Touch events for mobile support
    this.boundHandlers.touchstart = (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        this.handleMouseDown(e.touches[0]);
      }
    };
    this.boundHandlers.touchmove = (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        this.handleMouseMove(e.touches[0]);
      }
    };
    this.boundHandlers.touchend = () => this.handleMouseUp();

    this.cursorCanvas.addEventListener('touchstart', this.boundHandlers.touchstart);
    this.cursorCanvas.addEventListener('touchmove', this.boundHandlers.touchmove);
    this.cursorCanvas.addEventListener('touchend', this.boundHandlers.touchend);
  }

  /**
   * Handle mouse down
   */
  handleMouseDown(e) {
    // Middle mouse button or hand tool for panning
    if (e.button === 1 || this.currentTool === 'hand') {
      this.startPanning(e);
      return;
    }

    this.startDrawing(e);
  }

  /**
   * Handle mouse move
   */
  handleMouseMove(e) {
    // Update cursor position
    this.updateCursor(e);

    if (this.isPanning) {
      this.doPanning(e);
      return;
    }

    if (this.isDrawing) {
      this.draw(e);
    }
  }

  /**
   * Handle mouse up
   */
  handleMouseUp() {
    if (this.isPanning) {
      this.stopPanning();
      return;
    }
    this.stopDrawing();
  }

  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    this.clearCursor();
    this.stopDrawing();
    this.stopPanning();
  }

  /**
   * Handle mouse wheel for zoom
   */
  handleWheel(e) {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -this.options.zoomStep : this.options.zoomStep;
    const newZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, this.zoom + delta));

    if (newZoom !== this.zoom) {
      // Get mouse position relative to image before zoom
      const rect = this.cursorCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate position in image coordinates
      const imgX = mouseX / this.currentScale;
      const imgY = mouseY / this.currentScale;

      // Apply zoom
      this.zoom = newZoom;
      this.updateCanvasTransform();

      // Scroll to keep mouse position stable
      const newMouseX = imgX * this.currentScale;
      const newMouseY = imgY * this.currentScale;

      this.scrollContainer.scrollLeft += newMouseX - mouseX;
      this.scrollContainer.scrollTop += newMouseY - mouseY;

      if (this.onZoomChange) {
        this.onZoomChange(this.zoom);
      }

      // Update cursor size
      this.updateCursor(e);
    }
  }

  /**
   * Update custom cursor
   */
  updateCursor(e) {
    // Clear previous cursor
    this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);

    // Don't draw cursor circle for hand tool
    if (this.currentTool === 'hand') {
      return;
    }

    const coords = this.getCanvasCoords(e);

    // Draw cursor circle
    const radius = this.options.brushSize / 2;

    this.cursorCtx.beginPath();
    this.cursorCtx.arc(coords.x, coords.y, radius, 0, Math.PI * 2);
    this.cursorCtx.strokeStyle = this.currentTool === 'brush' ? '#ff0000' : '#ffffff';
    this.cursorCtx.lineWidth = 2 / this.currentScale; // Keep line width constant regardless of zoom
    this.cursorCtx.stroke();

    // Draw center dot
    this.cursorCtx.beginPath();
    this.cursorCtx.arc(coords.x, coords.y, 2 / this.currentScale, 0, Math.PI * 2);
    this.cursorCtx.fillStyle = this.currentTool === 'brush' ? '#ff0000' : '#ffffff';
    this.cursorCtx.fill();
  }

  /**
   * Clear cursor
   */
  clearCursor() {
    this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
  }

  /**
   * Start panning
   */
  startPanning(e) {
    this.isPanning = true;
    this.lastPanX = e.clientX;
    this.lastPanY = e.clientY;
    this.cursorCanvas.style.cursor = 'grabbing';
    this.clearCursor();
  }

  /**
   * Do panning
   */
  doPanning(e) {
    const dx = e.clientX - this.lastPanX;
    const dy = e.clientY - this.lastPanY;

    this.scrollContainer.scrollLeft -= dx;
    this.scrollContainer.scrollTop -= dy;

    this.lastPanX = e.clientX;
    this.lastPanY = e.clientY;
  }

  /**
   * Stop panning
   */
  stopPanning() {
    this.isPanning = false;
    // Restore cursor based on current tool
    if (this.currentTool === 'hand') {
      this.cursorCanvas.style.cursor = 'grab';
    } else {
      this.cursorCanvas.style.cursor = 'none';
    }
  }

  /**
   * Get canvas coordinates from event
   * @param {MouseEvent|Touch} e - Event object
   * @returns {Object} - { x, y } coordinates on the actual canvas
   */
  getCanvasCoords(e) {
    const rect = this.cursorCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.currentScale;
    const y = (e.clientY - rect.top) / this.currentScale;
    return { x, y };
  }

  /**
   * Start drawing
   * @param {MouseEvent|Touch} e - Event object
   */
  startDrawing(e) {
    this.isDrawing = true;
    const coords = this.getCanvasCoords(e);
    this.lastX = coords.x;
    this.lastY = coords.y;

    // Draw a single dot
    this.drawDot(coords.x, coords.y);
  }

  /**
   * Draw while moving
   * @param {MouseEvent|Touch} e - Event object
   */
  draw(e) {
    if (!this.isDrawing) return;

    const coords = this.getCanvasCoords(e);

    // Draw line from last position to current
    this.drawLine(this.lastX, this.lastY, coords.x, coords.y);

    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  /**
   * Stop drawing
   */
  stopDrawing() {
    if (this.isDrawing && this.onMaskChange) {
      this.onMaskChange();
    }
    this.isDrawing = false;
  }

  /**
   * Draw a dot at position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  drawDot(x, y) {
    this.maskCtx.beginPath();
    this.maskCtx.arc(x, y, this.options.brushSize / 2, 0, Math.PI * 2);

    if (this.currentTool === 'brush') {
      this.maskCtx.fillStyle = this.options.maskColor;
      this.maskCtx.fill();
    } else {
      // Eraser - use destination-out composite
      this.maskCtx.globalCompositeOperation = 'destination-out';
      this.maskCtx.fillStyle = 'rgba(0, 0, 0, 1)';
      this.maskCtx.fill();
      this.maskCtx.globalCompositeOperation = 'source-over';
    }
  }

  /**
   * Draw a line between two points
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   */
  drawLine(x1, y1, x2, y2) {
    this.maskCtx.beginPath();
    this.maskCtx.moveTo(x1, y1);
    this.maskCtx.lineTo(x2, y2);
    this.maskCtx.lineWidth = this.options.brushSize;
    this.maskCtx.lineCap = 'round';
    this.maskCtx.lineJoin = 'round';

    if (this.currentTool === 'brush') {
      this.maskCtx.strokeStyle = this.options.maskColor;
      this.maskCtx.stroke();
    } else {
      // Eraser
      this.maskCtx.globalCompositeOperation = 'destination-out';
      this.maskCtx.strokeStyle = 'rgba(0, 0, 0, 1)';
      this.maskCtx.stroke();
      this.maskCtx.globalCompositeOperation = 'source-over';
    }
  }

  /**
   * Set current tool
   * @param {string} tool - 'brush', 'eraser', or 'hand'
   */
  setTool(tool) {
    this.currentTool = tool;

    // Update cursor style based on tool
    if (tool === 'hand') {
      this.cursorCanvas.style.cursor = 'grab';
      this.clearCursor();
    } else {
      this.cursorCanvas.style.cursor = 'none';
    }
  }

  /**
   * Set brush size
   * @param {number} size - Brush size in pixels
   */
  setBrushSize(size) {
    this.options.brushSize = Math.max(
      this.options.minBrushSize,
      Math.min(this.options.maxBrushSize, size)
    );
  }

  /**
   * Get brush size
   * @returns {number} - Current brush size
   */
  getBrushSize() {
    return this.options.brushSize;
  }

  /**
   * Set zoom level
   * @param {number} zoom - Zoom level (1 = 100%)
   */
  setZoom(zoom) {
    this.zoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, zoom));
    this.updateCanvasTransform();

    if (this.onZoomChange) {
      this.onZoomChange(this.zoom);
    }
  }

  /**
   * Get current zoom level
   * @returns {number} - Current zoom
   */
  getZoom() {
    return this.zoom;
  }

  /**
   * Zoom in
   */
  zoomIn() {
    this.setZoom(this.zoom + this.options.zoomStep);
  }

  /**
   * Zoom out
   */
  zoomOut() {
    this.setZoom(this.zoom - this.options.zoomStep);
  }

  /**
   * Reset zoom to fit
   */
  resetZoom() {
    this.fitToContainer();
  }

  /**
   * Clear the mask
   */
  clearMask() {
    this.maskCtx.clearRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
    if (this.onMaskChange) {
      this.onMaskChange();
    }
  }

  /**
   * Check if mask has any content
   * @returns {boolean} - True if mask has content
   */
  hasMask() {
    const imageData = this.maskCtx.getImageData(
      0, 0,
      this.maskCanvas.width,
      this.maskCanvas.height
    );

    // Check if any pixel has alpha > 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the mask as ImageData (binary: white = inpaint, black = preserve)
   * @returns {ImageData} - Binary mask for AI processing
   */
  getMaskImageData() {
    const width = this.maskCanvas.width;
    const height = this.maskCanvas.height;

    // Get the colored mask
    const maskData = this.maskCtx.getImageData(0, 0, width, height);

    // Create binary mask (white = 255 where mask is, black = 0 elsewhere)
    const binaryMask = new ImageData(width, height);

    for (let i = 0; i < maskData.data.length; i += 4) {
      // If pixel has any alpha (was painted), mark as white (inpaint)
      if (maskData.data[i + 3] > 0) {
        binaryMask.data[i] = 255;     // R
        binaryMask.data[i + 1] = 255; // G
        binaryMask.data[i + 2] = 255; // B
        binaryMask.data[i + 3] = 255; // A
      } else {
        binaryMask.data[i] = 0;       // R
        binaryMask.data[i + 1] = 0;   // G
        binaryMask.data[i + 2] = 0;   // B
        binaryMask.data[i + 3] = 255; // A
      }
    }

    return binaryMask;
  }

  /**
   * Get the mask resized for model input
   * @param {number} targetSize - Target size (e.g., 512)
   * @returns {ImageData} - Resized binary mask
   */
  getMaskForModel(targetSize = CONFIG.MODEL.INPUT_SIZE) {
    // Create temporary canvas for resizing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetSize;
    tempCanvas.height = targetSize;
    const tempCtx = tempCanvas.getContext('2d');

    // First, create a canvas with the binary mask
    const binaryCanvas = document.createElement('canvas');
    binaryCanvas.width = this.maskCanvas.width;
    binaryCanvas.height = this.maskCanvas.height;
    const binaryCtx = binaryCanvas.getContext('2d');
    binaryCtx.putImageData(this.getMaskImageData(), 0, 0);

    // Resize to target size
    tempCtx.drawImage(binaryCanvas, 0, 0, targetSize, targetSize);

    return tempCtx.getImageData(0, 0, targetSize, targetSize);
  }

  /**
   * Destroy the editor and clean up
   */
  destroy() {
    if (this.cursorCanvas) {
      this.cursorCanvas.removeEventListener('mousedown', this.boundHandlers.mousedown);
      this.cursorCanvas.removeEventListener('mousemove', this.boundHandlers.mousemove);
      this.cursorCanvas.removeEventListener('mouseup', this.boundHandlers.mouseup);
      this.cursorCanvas.removeEventListener('mouseleave', this.boundHandlers.mouseleave);
      this.cursorCanvas.removeEventListener('wheel', this.boundHandlers.wheel);
      this.cursorCanvas.removeEventListener('touchstart', this.boundHandlers.touchstart);
      this.cursorCanvas.removeEventListener('touchmove', this.boundHandlers.touchmove);
      this.cursorCanvas.removeEventListener('touchend', this.boundHandlers.touchend);
    }
    this.container.innerHTML = '';
    this.imageBitmap = null;
    this.boundHandlers = {};
  }
}
