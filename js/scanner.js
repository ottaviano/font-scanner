/**
 * Created by Dimitri Gritsajuk on 06/04/15.
 */
var Scanner = {
    canvas: null,
    context: null,
    matrix: [],
    currentCharCode: 0,
    minY: null,
    maxY: null,
    minX: null,
    maxX: null,
    origCanvasWith: null,
    origCanvasHeight: null,
    fontSize: 20,

    configuration: {
        fontFamily: 'arial',
        displayMode: 'js'
    },

    /**
     *
     */
    start: function(configuration) {
        this.setConfiguration(configuration);
        this.initialize();

        for (var i = 65; i <= 90; i++) {
            this.currentCharCode = i;
            this.printChar(i);
            this.startScannerChar();
            this.clear();
        }

        this.matrixScaling();

        this.displayResult();
        this.resetCanvas();
    },

    /**
     * Save scanner configuration
     *
     * @param configuration
     */
    setConfiguration: function(configuration) {
        if (configuration.fontFamily) {
            this.configuration.fontFamily = configuration.fontFamily;
        }

        if (configuration.displayMode) {
            this.configuration.displayMode = configuration.displayMode;
        }

        if (configuration.idResultBlock) {
            this.configuration.idResultBlock = configuration.idResultBlock;
        }

        if (configuration.resultWriter) {
            this.configuration.resultWriter = configuration.resultWriter;
        }
    },

    /**
     *
     */
    initialize: function() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.fontSize;
        this.canvas.height = this.fontSize;
        this.context = this.canvas.getContext('2d');

        this.origCanvasWith = this.canvas.width;
        this.origCanvasHeight = this.canvas.height;

        this.scaleCanvas();
        this.fontConfiguration();
    },

    /**
     *
     */
    fontConfiguration: function() {
        this.context.font = this.origCanvasHeight + 'px ' + this.configuration.fontFamily;
        this.context.textBaseline = 'top';
    },

    /**
     *
     */
    displayResult: function() {
        if (this.configuration.resultWriter) {
            this.configuration.resultWriter.write(this.matrix, this.configuration.idResultBlock);
        }
    },

    /**
     *
     */
    matrixScaling: function() {
        var scalingMatrix = [];
        var maxCharWidth = this.maxX - this.minX;
        var maxCharHeight = this.maxY - this.minY;

        for (var i in this.matrix) {
            var charMatrix = this.matrix[i];
            var charMinX = null;
            var charMaxX = null;
            for (var x = this.minX; x <= this.maxX; x++) {
                for (var y = this.minY; y <= this.maxY; y++) {
                    if (charMatrix[x][y] == 1) {
                        if (charMinX == null) {
                            charMinX = x;
                        }
                        if (charMaxX < x) {
                            charMaxX = x;
                        }
                    }

                }
            }

            scalingMatrix[i] = [];
            for (var x = 0; x <= maxCharWidth; x++) {
                scalingMatrix[i][x] = [];
                for (var y = 0; y <= maxCharHeight; y++) {
                    scalingMatrix[i][x][y] = 0;
                }
            }

            var charWidth = charMaxX - charMinX;
            var margin = maxCharWidth - charWidth;
            var halfMargin = Math.floor(margin/2);

            for (var x = charMinX; x <= charMaxX; x++) {
                for (var y = this.minY; y < this.maxY; y++) {
                    scalingMatrix[i][halfMargin + x - charMinX][y - this.minY] = charMatrix[x][y];
                }
            }
        }
        this.matrix = scalingMatrix;
    },

    /**
     *
     */
    resetCanvas: function() {
        this.canvas.width = this.origCanvasWith;
        this.canvas.height = this.origCanvasHeight;
    },

    /**
     *
     */
    scaleCanvas: function() {
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                this.context.mozBackingStorePixelRatio ||
                this.context.msBackingStorePixelRatio ||
                this.context.oBackingStorePixelRatio ||
                this.context.backingStorePixelRatio || 1,

            ratio = devicePixelRatio / backingStoreRatio;

        // upscale the canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {

            var oldWidth = this.canvas.width;
            var oldHeight = this.canvas.height;

            this.canvas.width = oldWidth * ratio;
            this.canvas.height = oldHeight * ratio;

            this.canvas.style.width = oldWidth + 'px';
            this.canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            this.context.scale(ratio, ratio);
        }
    },

    /**
     * @param code
     */
    printChar: function(code) {
       this.context.fillText(String.fromCharCode(code), 0, 0);
    },

    /**
     *
     */
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /**
     *
     * @param x
     * @param y
     */
    setMinMax: function(x, y) {
        // Set minX
        if (this.minX > x || this.minX == null) {
            this.minX = x;
        }

        // Set maxX
        if (this.maxX < x) {
            this.maxX = x;
        }

        // Set minY
        if (this.minY > y || this.minY == null) {
            this.minY = y;
        }

        // Set maxY
        if (this.maxY < y) {
            this.maxY = y;
        }
    },

    /**
     *
     */
    startScannerChar: function() {
        var charMatrix = [];
        var pixelData, pixelSum;
        for (var x = 0; x < this.canvas.width; x++) {
            charMatrix[x] = [];
            for (var y = 0; y < this.canvas.height; y++) {
                pixelData = this.context.getImageData(x, y, 1, 1).data;
                pixelSum = pixelData[0] + pixelData[1] + pixelData[2] + pixelData[3];
                if (pixelSum > 0) {
                    charMatrix[x].push(1);
                    this.setMinMax(x, y);
                } else {
                    charMatrix[x].push(0);
                }
            }
        }
        this.matrix[this.currentCharCode] = charMatrix;
    }
};
