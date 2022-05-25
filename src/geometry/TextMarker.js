import {extend, hasOwn} from '../core/util';
import {splitTextToRow, escapeSpecialChars} from '../core/util/strings';
import Marker from './Marker';

const defaultSymbol = {
    'textFaceName': 'monospace',
    'textSize': 12,
    'textLineSpacing': 8,
    'textWrapCharacter': '\n',
    'textHorizontalAlignment': 'middle', //left middle right
    'textVerticalAlignment': 'middle' //top middle bottom
};

const defaultBoxSymbol = {
    'markerType': 'square',
    'markerLineColor': '#000',
    'markerLineWidth': 2,
    'markerLineOpacity': 1,
    'markerFill': '#fff',
    'markerOpacity': 1
};

/**
 * @classdesc
 * Base class for  the Text marker classes, a marker which has text and background box. <br>
 * It is abstract and not intended to be instantiated.
 * @category geometry
 * @abstract
 * @extends Marker
 */
class TextMarker extends Marker {

    /**
     * Get text content of the label
     * @returns {String}
     */
    getContent() {
        return this._content;
    }

    /**
     * Set a new text content to the label
     * @return {Label} this
     * @fires Label#contentchange
     */
    setContent(content) {
        const old = this._content;
        this._content = escapeSpecialChars(content);
        this._refresh();
        /**
         * an event when changing label's text content
         * @event Label#contentchange
         * @type {Object}
         * @property {String} type - contentchange
         * @property {Label} target - label fires the event
         * @property {String} old - old content
         * @property {String} new - new content
         */
        this._fireEvent('contentchange', {
            'old': old,
            'new': content
        });
        return this;
    }

    onAdd() {
        this._refresh();
    }

    toJSON() {
        const json = super.toJSON();
        delete json['symbol'];
        return json;
    }

    setSymbol(symbol, update) {
        if (this._refreshing || !symbol || update) {
            return super.setSymbol(symbol);
        }
        const s = this._parseSymbol(symbol);
        if (this.setTextStyle) {
            const style = this.getTextStyle() || {};
            style.symbol = s[0];
            this.options.textStyle = style ? extend({}, style) : style;
        } else if (this.setTextSymbol) {
            this.options.textSymbol = s[0] ? extend({}, s[0]) : s[0];
        }
        if (this.setBoxStyle) {
            const style = this.getBoxStyle() || {};
            style.symbol = s[1];
            // this.setBoxStyle(style);
            this.options.boxStyle = style ? extend({}, style) : style;
        } else if (this.setBoxSymbol) {
            // this.setBoxSymbol(s[1]);
            this.options.boxSymbol = s[1] ? extend({}, s[1]) : s[1];
        }
        if (this.setMarkerSymbol) {
            this.options.markerSymbol = s[2] ? extend({}, s[2]) : s[2];
        }
        if (this._refresh) {
            this._refresh();
        }
        return this;
    }

    _parseSymbol(symbol) {
        if (Array.isArray(symbol)) {
            const s = this._parseSymbol(symbol[0]);
            return [s[0], s[1], symbol[1]];
        }
        const t = {};
        const b = {};
        for (const p in symbol) {
            if (hasOwn(symbol, p)) {
                if (p.indexOf('text') === 0) {
                    t[p] = symbol[p];
                } else {
                    b[p] = symbol[p];
                }
            }
        }
        return [t, b];
    }

    _getTextSize(symbol) {
        return splitTextToRow(this._content, symbol)['size'];
    }

    _getInternalSymbol() {
        return this._symbol;
    }

    _getDefaultTextSymbol() {
        return extend({}, defaultSymbol);
    }

    _getDefaultBoxSymbol() {
        return extend({}, defaultBoxSymbol);
    }

    _getDefaultPadding() {
        return [12, 8];
    }
}

export default TextMarker;
