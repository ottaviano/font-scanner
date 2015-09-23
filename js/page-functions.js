function selectAll() {
    var containerId = 'matrix';
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerId));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerId));
        window.getSelection().addRange(range);
    }
}

window.onload = function() {
    launchScanner();
};

document.getElementById('submit').addEventListener('click', function(e) {
    launchScanner();
    e.preventDefault();
    e.stopPropagation();
});

function launchScanner() {
    var fontFamily = document.getElementById('font-family').value;
    var outputFormat = document.getElementById('output-format').value;
    Scanner.start({
        fontFamily:fontFamily,
        outputFormat: outputFormat,
        idResultBlock: 'matrix',
        resultWriter: writerFactory(outputFormat)
    });
}

function writerFactory(outputFormat) {
    switch(outputFormat) {
        case 'php':
            return PHPWriter;
        case 'java':
            return null;
        default:
            return JSWriter;
    }
}