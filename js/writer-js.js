/**
 * Created by dimitrigr on 22/09/2015.
 */
var JSWriter = {
    write: function(matrix, idContentBlock) {
        var content = 'var matrix = {\n';
        for (var i in matrix) {
            content += '    ' + i + ': [ // ' + String.fromCharCode(i) + '\n';
            for (var y in matrix[i][0]) {
                content += '            [';
                for (var x in matrix[i]) {
                    content += matrix[i][x][y] + ',';
                }
                content += '], \n';
            }
            content += '        ],\n';
        }
        content += '};';
        document.getElementById(idContentBlock).innerHTML = content;
    }
};