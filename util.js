class Util {

    static iMaxPieces = 0;
    static  iOriginalPieces = this.iMaxPieces / 4;
    static iRowSize = Math.sqrt(this.iOriginalPieces);
    static idCounter = 0;
 
    constructor() {
        if (this instanceof Util) {
            throw Error('A static class cannot be instantiated.');
        }
    }

    static setMetadata(maxPieces) {
        this.iMaxPieces = maxPieces;
        this.iOriginalPieces = this.iMaxPieces / 4;
        this.iRowSize = Math.sqrt(this.iOriginalPieces);
    
    }


    static generatePieceArray(aPiece) {
        var _aPiece = [];

        aPiece.forEach(oPiece => {
            let oPiece2 = oPiece.rotate();
            let oPiece3 = oPiece2.rotate();
            let oPiece4 = oPiece3.rotate();

            _aPiece.push(oPiece);
            _aPiece.push(oPiece2);
            _aPiece.push(oPiece3);
            _aPiece.push(oPiece4);
        });

        return _aPiece;
    }

    static compareLeft(oCurrentPiece, oCheckPiece) {
        //Gleiches Teil aber rotiert, daher ignorieren
        if (oCurrentPiece._sId === oCheckPiece._sId) {
            return false;
        }

        let sColorCurrent = oCurrentPiece._color.toString();
        let sColorCheck = oCheckPiece._color.toString();

        //Index 1 und Index 2 = Rechte Seite, Index 0 und Index 3 = Linke Seite
        if (sColorCheck[0] === sColorCurrent[1] && sColorCheck[3] === sColorCurrent[2]) {
            return true;
        }

        return false;
    }

    static compareUp(oCurrentPiece, oCheckPiece) {
        //Gleiches Teil aber rotiert, daher ignorieren
        if (oCurrentPiece._sId === oCheckPiece._sId) {
            return false;
        }

        let sColorCurrent = oCurrentPiece._color.toString();
        let sColorCheck = oCheckPiece._color.toString();

        //Index 0 und Index 1 = Obere Seite, Index 2 und Index 3 = Untere Seite
        if (sColorCheck[0] === sColorCurrent[3] && sColorCheck[1] === sColorCurrent[2]) {
            return true;
        }

        return false;
    }

    static findNextPiece(aCurrentSolution, aAvailablePieces, aAllSolution, iDepth) {
        var aPossibleMatches = [];
        iDepth++;

        //Lösung gefunden
        if (aCurrentSolution.length === this.iOriginalPieces) {
            aAllSolution.push(aCurrentSolution);
            return;
        }
        //Start ohne vorherige Teile        
        else if (aCurrentSolution.length === 0) {

            aPossibleMatches = aAvailablePieces;
        }
        else {
            //Wenn erste Zeile, nur Links schauen
            var iNewIndex = aCurrentSolution.length; //= - 1 für aktuelle Position +1 für neue Position vom zu suchenden Teil, daher belassen;
            var iCurrentPieceIndex = aCurrentSolution.length - 1;
            if (iNewIndex <= this.iRowSize - 1) {
                aAvailablePieces.forEach(oAvailablePiece => {
                    if (this.compareLeft(aCurrentSolution[iCurrentPieceIndex], oAvailablePiece)) {
                        //console.log(`Passendes Teil zu ${aCurrentSolution[iCurrentPieceIndex].print()} gefunden: ${oAvailablePiece.print()} (compareLeft)`);
                        aPossibleMatches.push(oAvailablePiece);
                    }
                });
                //aAvailablePieces = this.cleanupAvailablePieces(aAvailablePieces, aPossibleMatches);
            }
            //Wenn erste Reihe, nur oben schauen
            //  0  1  2  3
            //  4  5  6  7
            //  8  9 10 11
            // 12 13 14 15

            // 0 1
            // 2 3

            // => Index für oben prüfen = letztes Stück - 4

            //else if (iNewIndex === 4 || iNewIndex === 8 || iNewIndex === 12) {
            else if (iNewIndex % this.iRowSize === 0) {
                aAvailablePieces.forEach(oAvailablePiece => {
                    if (this.compareUp(aCurrentSolution[iNewIndex - this.iRowSize], oAvailablePiece)) {
                        aPossibleMatches.push(oAvailablePiece);
                    }
                });
            }
            //Sonst links und oben schauen
            else {
                aAvailablePieces.forEach(oAvailablePiece => {
                    if (this.compareLeft(aCurrentSolution[iCurrentPieceIndex], oAvailablePiece) &&
                        this.compareUp(aCurrentSolution[iNewIndex - this.iRowSize], oAvailablePiece)) {
                        aPossibleMatches.push(oAvailablePiece);
                    }
                });
            }
        }

        aPossibleMatches.forEach(oPossibleMatch => {
            //Neue Rekursion mit kopierten Zuständen
            let aNewSolution = [...aCurrentSolution];
            aNewSolution.push(oPossibleMatch);
            let aNewAvailablePiece = this.cleanupAvailablePieces(aAvailablePieces, aNewSolution);

            this.findNextPiece(aNewSolution, aNewAvailablePiece, aAllSolution, iDepth);
        });

    }

    static checkColor(oElement) {
        return oElement._originalColor != this._originalColor;
    }

    static cleanupAvailablePieces(aAvailablePieces, aSolution) {
        for (var i=0; i<aSolution.length; i++) {
             var aFilteredArray = aAvailablePieces.filter(this.checkColor, aSolution[i]);
        }
        return aFilteredArray;
    }
}

module.exports =  Util 