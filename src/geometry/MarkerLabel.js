import Label from './Label';
import {extend, getAlignPoint} from '../core/util';

class MarkerLabel extends Label {

    getMarkerSymbol() {
        if (!this.options.markerSymbol) {
            return null;
        }
        return extend({}, this.options.markerSymbol);
    }

    setMarkerSymbol(symbol) {
        this.options.markerSymbol = symbol ? extend({}, symbol) : symbol;
        this._refresh();
        return this;
    }

    _refresh() {
        let symbol = extend({},
            this.getTextSymbol(),
            {
                'textName': this._content
            });

        const boxStyle = this.getBoxStyle();
        if (boxStyle) {
            extend(symbol, boxStyle.symbol);
            const sizes = this._getBoxSize(symbol),
                textSize = sizes[1],
                padding = this._getPadding(boxStyle['padding']);
            const boxSize = sizes[0];
            //if no boxSize then use text's size in default
            symbol['markerWidth'] = boxSize['width'];
            symbol['markerHeight'] = boxSize['height'];

            symbol['textDx'] = symbol['textDx'] || 0;
            symbol['textDy'] = symbol['textDy'] || 0;

            const dx = symbol['textDx'],
                dy = symbol['textDy'],
                textAlignPoint = getAlignPoint(textSize, symbol['textHorizontalAlignment'], symbol['textVerticalAlignment'])
                    ._add(dx, dy);

            const hAlign = boxStyle['horizontalAlignment'] || 'middle';
            symbol['markerDx'] = textAlignPoint.x;
            if (hAlign === 'left') {
                symbol['markerDx'] += symbol['markerWidth'] / 2;
                symbol['textDx'] += padding[0];
            } else if (hAlign === 'right') {
                symbol['markerDx'] -= symbol['markerWidth'] / 2 - textSize['width'];
                symbol['textDx'] -= padding[1];
            } else {
                symbol['markerDx'] += textSize['width'] / 2;
            }

            const vAlign = boxStyle['verticalAlignment'] || 'middle';
            symbol['markerDy'] = textAlignPoint.y;
            if (vAlign === 'top') {
                symbol['markerDy'] += symbol['markerHeight'] / 2;
                symbol['textDy'] -= padding[1];
            } else if (vAlign === 'bottom') {
                symbol['markerDy'] -= symbol['markerHeight'] / 2 - textSize['height'];
                symbol['textDy'] += padding[3];
            } else {
                symbol['markerDy'] += textSize['height'] / 2;
            }
        }
        const markerSymbol = this.getMarkerSymbol();
        if (markerSymbol) {
            symbol = [symbol, extend({}, markerSymbol)];
        }
        this._refreshing = true;
        this.setSymbol(symbol);
        delete this._refreshing;
    }

    _getPadding(padding) {
        if (!padding) padding = this._getDefaultPadding();
        padding = padding.slice(0, 4);
        // eslint-disable-next-line no-unused-expressions
        padding[0] === undefined && (padding[0] = 0);
        // eslint-disable-next-line no-unused-expressions
        padding[1] === undefined && (padding[1] = 0);
        // eslint-disable-next-line no-unused-expressions
        padding[2] === undefined && (padding[2] = padding[0]);
        // eslint-disable-next-line no-unused-expressions
        padding[3] === undefined && (padding[3] = padding[1]);
        return padding;
    }
}

MarkerLabel.registerJSONType('MarkerLabel');

export default MarkerLabel;
