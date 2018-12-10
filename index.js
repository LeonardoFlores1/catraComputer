
(function ($) {

    $.fn.linedtextarea = function (options) {

        // Get the Options
        var opts = $.extend({}, $.fn.linedtextarea.defaults, options);


		/*
		 * Helper function to make sure the line numbers are always
		 * kept up to the current system
		 */
        var fillOutLines = function (codeLines, h, lineNo) {
            while ((codeLines.height() - h) <= 0) {
                if (lineNo == opts.selectedLine)
                    codeLines.append("<div class='lineno lineselect'>" + lineNo + "</div>");
                else
                    codeLines.append("<div class='lineno'>" + lineNo + "</div>");

                lineNo++;
            }
            return lineNo;
        };


		/*
		 * Iterate through each of the elements are to be applied to
		 */
        return this.each(function () {
            var lineNo = 001;
            var textarea = $(this);

            /* Turn off the wrapping of as we don't want to screw up the line numbers */
            textarea.attr("wrap", "off");
            textarea.css({ resize: 'none' });
            var originalTextAreaWidth = textarea.outerWidth();

            /* Wrap the text area in the elements we need */
            textarea.wrap("<div class='linedtextarea'></div>");
            var linedTextAreaDiv = textarea.parent().wrap("<div class='linedwrap' style='width:" + originalTextAreaWidth + "px'></div>");
            var linedWrapDiv = linedTextAreaDiv.parent();

            linedWrapDiv.prepend("<div class='lines' style='width:50px'></div>");

            var linesDiv = linedWrapDiv.find(".lines");
            linesDiv.height(textarea.height() + 6);


            /* Draw the number bar; filling it out where necessary */
            linesDiv.append("<div class='codelines'></div>");
            var codeLinesDiv = linesDiv.find(".codelines");
            lineNo = fillOutLines(codeLinesDiv, linesDiv.height(), 1);

            /* Move the textarea to the selected line */
            if (opts.selectedLine != -1 && !isNaN(opts.selectedLine)) {
                var fontSize = parseInt(textarea.height() / (lineNo - 2));
                var position = parseInt(fontSize * opts.selectedLine) - (textarea.height() / 2);
                textarea[0].scrollTop = position;
            }


            /* Set the width */
            var sidebarWidth = linesDiv.outerWidth();
            var paddingHorizontal = parseInt(linedWrapDiv.css("border-left-width")) + parseInt(linedWrapDiv.css("border-right-width")) + parseInt(linedWrapDiv.css("padding-left")) + parseInt(linedWrapDiv.css("padding-right"));
            var linedWrapDivNewWidth = originalTextAreaWidth - paddingHorizontal;
            var textareaNewWidth = originalTextAreaWidth - sidebarWidth - paddingHorizontal - 20;

            textarea.width(textareaNewWidth);
            linedWrapDiv.width(linedWrapDivNewWidth);



            /* React to the scroll event */
            textarea.scroll(function (tn) {
                var domTextArea = $(this)[0];
                var scrollTop = domTextArea.scrollTop;
                var clientHeight = domTextArea.clientHeight;
                codeLinesDiv.css({ 'margin-top': (-1 * scrollTop) + "px" });
                lineNo = fillOutLines(codeLinesDiv, scrollTop + clientHeight, lineNo);
            });


            /* Should the textarea get resized outside of our control */
            textarea.resize(function (tn) {
                var domTextArea = $(this)[0];
                linesDiv.height(domTextArea.clientHeight + 6);
            });

        });
    };

    // default options
    $.fn.linedtextarea.defaults = {
        selectedLine: -1,
        selectedClass: 'lineselect'
    };
})(jQuery);


function depurar() {
    var programa = $("#campoPrograma").val();
    var partesDePrograma = programa.split("\n");//lineas del programa ubicacion e contenido
    //console.log(partesDePrograma.length);
    for (var i = 0; i < partesDePrograma.length; i++) {
        var linea = partesDePrograma[i].split(" ");
        var grilla = i + 1;
        var instruccion = linea[1].substring(0, 2);
        if (verificarInstruccion(instruccion) && grilla != 7) {
            $("#campoDepuracion").append("Error: instruccion incorrecta en linea " + grilla + "\n");
        }

    }

    for (var i = 0; i < partesDePrograma.length; i++) {
        var linea = partesDePrograma[i].split(" ");
        var grilla = i + 1;
        var direccion = linea[1].substring(2, 7);
        if (verificarDireccion(direccion)) {
            $("#campoDepuracion").append("Error: Direccion de memoria fuera de rango/invalido en linea " + grilla + "\n");

        }
    }

}

function verificarInstruccion(instruccion) {
    var validas = ["00", "10", "11", "20", "21", "30", "31", "32", "33", "40", "41", "42", "43"];
    var respuesta = true;
    for (var i = 0; i < validas.length; i++) {
        if (instruccion == validas[i]) {
            respuesta = false;
        }

    }
    return respuesta;
}

function verificarDireccion(direccion) {
    var direccionN = parseInt(direccion);
    if (direccionN > 999)
        return true;
}

function ejecutar() {
    //depurar();
    var acumulador = 0;
    var cont = 0;
    var programa = $("#campoPrograma").val();
    var partesDePrograma = new Array();
    partesDePrograma = programa.split("\n");
    var i = 0
    for (i; i < partesDePrograma.length; i++) {
        sleep(1000);
        var linea = partesDePrograma[i].split(" ");
        var instruccion = linea[1].substring(0, 2);
        var grilla = i + 1;
        if (partesDePrograma[i + 1] != null) {
            var partesSiguiente = partesDePrograma[i + 1].split(" ");
            document.getElementById("PC").innerHTML = partesSiguiente[0];
            $("#PC").html("PC=" + partesSiguiente[0]);
        }
        $("#IR").html("IR=" + linea[0]);
        $("#AC").html("AC=" + acumulador);

        console.log("_______________________________________________________________________________" + "\n");
        if (partesDePrograma[i + 1] != null)
            console.log("PC=" + partesSiguiente[0] + "\n");
        else {
            console.log("PC=" + 0 + "\n");
        }
        console.log("IR=" + linea[0] + "\n");
        console.log("AC=" + acumulador + "\n");
        console.log("_______________________________________________________________________________" + "\n");
        switch (instruccion) {
            case "00":
                sleep(1000);//declarar variables
                var valor = parseInt(linea[1].substring(2, 5));
                partesDePrograma[i] += " " + valor;
                break;
            case "10":
                sleep(1000);
                //leer de teclado
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                var constante = bloque[0] + " " + bloque[1] + " ";
                var result;
                result = prompt('Ingrese el valor de la variable:', '');
                constante += parseInt(result);
                partesDePrograma.splice(direccionAct, 1, constante);
                break;
            case "11":
                sleep(1000);

                var direccionImpr = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionImpr].split(" ");
                var palabra = bloque[2];
                if (palabra == null)
                    $("#campoDepuracion").append("Direccion de memoria inexistente linea: " + grilla);
                //error direccion no creada
                else
                    $("#campoEjecucion").append(palabra + "\n");

                break;
            case "20":
                sleep(1000);
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                //console.log("estae es el problema:"+bloque[2])
                var palabra;
                if (isNaN(bloque[2])) {
                    palabra = 0;
                }
                else {
                    palabra = parseInt(bloque[2]);
                }
                //console.log("esta es la palabra:"+palabra);
                acumulador = palabra;

                break;
            case "21":
                sleep(1000);
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                var constante = bloque[0] + " " + bloque[1] + " ";
                var result;
                constante += parseInt(acumulador);
                partesDePrograma.splice(direccionAct, 1, constante);
                break;
            case "30":
                sleep(1000);
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                var palabra = parseInt(bloque[2]);
                //console.log("la suma de: "+acumulador+" + "+palabra+"es:");

                acumulador = parseInt(acumulador) + palabra;
                //console.log(acumulador);

                break;
            case "31":
                sleep(1000);
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                var palabra = parseInt(bloque[2]);
                // console.log("la resta de: "+acumulador+" - "+palabra+"es:");
                acumulador = parseInt(acumulador) - palabra;
                // console.log(acumulador);
                break;
            case "32":
                sleep(1000);
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                var palabra = parseInt(bloque[2]);
                //console.log("la division de: "+palabra+" / "+acumulador+"es:");
                acumulador = palabra / parseInt(acumulador);
                // console.log(acumulador);
                break;
            case "33":
                sleep(1000);
                var direccionAct = parseInt(linea[1].substring(2, 5));
                var bloque = partesDePrograma[direccionAct].split(" ");
                var palabra = parseInt(bloque[2]);
                // console.log("la multiplicacion de: "+acumulador+" * "+palabra+"es:");
                acumulador = palabra / parseInt(acumulador);
                //  console.log(acumulador);
                break;
            case "40":
                sleep(1000);
                var valor = parseInt(linea[1].substring(2, 5));
                i = valor - 1;
                break;
            case "41":
                sleep(1000);
                if (acumulador < 0) {
                    var valor = parseInt(linea[1].substring(2, 5));
                    i = valor - 1;
                    break;
                }
                else
                    break;
            case "42":
                sleep(1000);
                if (acumulador == 0) {
                    var valor = parseInt(linea[1].substring(2, 5));
                    i = valor - 1;
                    break;
                }
                else
                    break;
            case "43":
                sleep(1000);
                i = partesDePrograma.length + 1
                $("#campoEjecucion").append("Programa Finalizado con exito." + "\n");
                break;
            default:
        }


    }
}


window.onload = function () {
    var fileInput = document.getElementById('fileInput');
    var campoPrograma = document.getElementById('campoPrograma');

    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function (e) {
                campoPrograma.innerText = reader.result;
            }

            reader.readAsText(file);
        } else {
            campoPrograma.innerText = "File not supported!"
        }
    });
}



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function limpiarCampos() {
    $("#campoPrograma").val(" ");
    $("#campoEjecucion").val(" ");
    $("#campoDepuracion").val(" ");
}