import Label from './Label';
import { extend, getAlignPoint } from '../core/util';

class MarkerLabel extends Label {

    getMarkerStyle() {
        if (!this.options.markerSymbol) {
            return null;
        }
        return extend({}, this.options.markerSymbol);
    }

    setMarkerStyle(style) {
        this.options.markerSymbol = style ? extend({}, style) : style;
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
                padding = boxStyle['padding'] || this._getDefaultPadding();
            const boxSize = sizes[0];
            //if no boxSize then use text's size in default
            symbol['markerWidth'] = boxSize['width'];
            symbol['markerHeight'] = boxSize['height'];

            const dx = symbol['textDx'] || 0,
                dy = symbol['textDy'] || 0,
                textAlignPoint = getAlignPoint(textSize, symbol['textHorizontalAlignment'], symbol['textVerticalAlignment'])
                    ._add(dx, dy);

            const hAlign = boxStyle['horizontalAlignment'] || 'middle';
            symbol['markerDx'] = textAlignPoint.x;
            if (hAlign === 'left') {
                symbol['markerDx'] += symbol['markerWidth'] / 2 - padding[0];
            } else if (hAlign === 'right') {
                symbol['markerDx'] -= symbol['markerWidth'] / 2 - textSize['width'] - (padding[2] || padding[0]);
            } else {
                symbol['markerDx'] += textSize['width'] / 2;
            }

            const vAlign = boxStyle['verticalAlignment'] || 'middle';
            symbol['markerDy'] = textAlignPoint.y;
            if (vAlign === 'top') {
                symbol['markerDy'] += symbol['markerHeight'] / 2 - padding[1];
            } else if (vAlign === 'bottom') {
                symbol['markerDy'] -= symbol['markerHeight'] / 2 - textSize['height'] - (padding[3] || padding[1]);
            } else {
                symbol['markerDy'] += textSize['height'] / 2;
            }
        }
        const markerStyle = this.getMarkerStyle();
        if (markerStyle) {
            symbol = [symbol, extend({}, markerStyle)];
        }
        this._refreshing = true;
        this.setSymbol(symbol);
        delete this._refreshing;
    }
}

MarkerLabel.registerJSONType('MarkerLabel');

export default MarkerLabel;
