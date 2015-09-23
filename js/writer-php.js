/**
 * Created by dimitrigr on 22/09/2015.
 */
var PHPWriter = {
    write: function(matrix, idContentBlock) {
        var content = '$matrix = array(\n';
        for (var i in matrix) {
            content += '    "' + i + '" => array( // ' + String.fromCharCode(i) + '\n';
            for (var y in matrix[i][0]) {
                content += '            array(';
                for (var x in matrix[i]) {
                    content += matrix[i][x][y] + ',';
                }
                content += '), \n';
            }
            content += '        ),\n';
        }
        content += ');';
        document.getElementById(idContentBlock).innerHTML = content;
    }
};