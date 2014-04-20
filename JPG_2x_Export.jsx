#target photoshop

app.bringToFront();

function main() {

    var doc = app.activeDocument;

    var lname = File.saveDialog('Please type in the file name WITHOUT the extension');
    saveLayer(doc.activeLayer, lname, false);

    function saveLayer(layer, lname, shouldMerge) {
        
        var startRulerUnits = app.preferences.rulerUnits
        var startTypeUnits = app.preferences.typeUnits
        var startDisplayDialogs = app.displayDialogs

        app.preferences.rulerUnits = Units.PIXELS
        app.preferences.typeUnits = TypeUnits.PIXELS
        app.displayDialogs = DialogModes.NO
        
        dupLayers();
        if (shouldMerge === undefined || shouldMerge === true) {
            activeDocument.mergeVisibleLayers();
        }
        activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
        if (activeDocument.width % 2 != 0) {
//            alert('increase width from ' + activeDocument.width + " to " + (activeDocument.width + 1));
            activeDocument.resizeCanvas(activeDocument.width + 1, activeDocument.height, AnchorPosition.MIDDLECENTER);
        }
        if (activeDocument.height % 2 != 0) {
//            alert('increase height from ' + activeDocument.height + " to " + (activeDocument.height + 1));
            activeDocument.resizeCanvas(activeDocument.width, activeDocument.height + 1, AnchorPosition.MIDDLECENTER);
        }
        var saveFile = File(lname + "@2x.jpg");
        SaveJPG(saveFile);
        activeDocument.resizeImage(undefined, undefined, app.activeDocument.resolution / 2, ResampleMethod.BICUBICSHARPER);
        saveFile = File(lname + ".jpg");
        SaveJPG(saveFile);
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        
        app.preferences.rulerUnits = startRulerUnits
        app.preferences.typeUnits = startTypeUnits
        app.displayDialogs = startDisplayDialogs
    }
}

main();

function dupLayers() {
    var descac = new ActionDescriptor();
    var refac1 = new ActionReference();
    refac1.putClass(charIDToTypeID('Dcmn'));
    descac.putReference(charIDToTypeID('null'), refac1);
    descac.putString(charIDToTypeID('Nm  '), activeDocument.activeLayer.name);
    var refac2 = new ActionReference();
    refac2.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    descac.putReference(charIDToTypeID('Usng'), refac2);
    executeAction(charIDToTypeID('Mk  '), descac, DialogModes.NO);
}

function SaveJPG(saveFile) {
    var jpgOpts = new ExportOptionsSaveForWeb;
    jpgOpts.format = SaveDocumentType.JPEG;
    jpgOpts.interlaced = false;
    jpgOpts.quality = 100;
    jpgOpts.optimized = false;
    activeDocument.exportDocument(new File(saveFile), ExportType.SAVEFORWEB, jpgOpts);

}
