import Taro, { Component } from '@tarojs/taro';
import { Canvas } from '@tarojs/components';
// qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.
import * as QRCodeImpl from 'qr.js/lib/QRCode';
import * as ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel';

// demo :
// import { QRCode } from "../../components";
// {
//     code ? (
//         <View className="flex justify-content-center">
//             <QRCode QRid="QRCode-id" size={182} value={code} />
//         </View>
//     ) : (
//             ""
//         )
// }

// Convert from UTF-16, forcing the use of byte-mode encoding in our QR Code.
// This allows us to encode Hanji, Kanji, emoji, etc. Ideally we'd do more
// detection and not resort to byte-mode if possible, but we're trading off
// a smaller library for a smaller amount of data we can potentially encode.
// Based on http://jonisalonen.com/2012/from-utf-16-to-utf-8-in-javascript/
function convertStr(str: string): string {
    let out = '';
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x0080) {
            out += String.fromCharCode(charcode);
        } else if (charcode < 0x0800) {
            out += String.fromCharCode(0xc0 | (charcode >> 6));
            out += String.fromCharCode(0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            out += String.fromCharCode(0xe0 | (charcode >> 12));
            out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
            out += String.fromCharCode(0x80 | (charcode & 0x3f));
        } else {
            // This is a surrogate pair, so we'll reconsitute the pieces and work
            // from that
            i++;
            charcode =
                0x10000 +
                (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            out += String.fromCharCode(0xf0 | (charcode >> 18));
            out += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
            out += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
            out += String.fromCharCode(0x80 | (charcode & 0x3f));
        }
    }
    return out;
}

interface QRProps {
    QRid: string;
    value: string;
    size: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    bgColor?: string;
    fgColor?: string;
    style?: Object;
}

export default class QRCode extends Component<QRProps, any> {
    static defaultProps = {
        size: 128,
        level: 'L',
        bgColor: '#FFFFFF',
        fgColor: '#000000'
    };

    componentDidMount() {
        this.update();
    }

    update() {
        const { QRid, value, size, level, bgColor, fgColor } = this.props;

        // We'll use type===-1 to force QRCode to automatically pick the best type
        const qrcode = new QRCodeImpl.default(-1, ErrorCorrectLevel[level]);
        qrcode.addData(convertStr(value));
        qrcode.make();

        // const canvas = Taro.createCanvasContext(QRid, this.$scope);

        // const ctx = canvas._context.canvas.getContext("2d");
        const ctx = Taro.createCanvasContext(QRid, this.$scope);
        if (!ctx) {
            return;
        }
        const cells = qrcode.modules;
        if (cells === null) {
            return;
        }
        const tileW = size / cells.length;
        const tileH = size / cells.length;
        // const scale = 1;
        // ctx.scale(scale, scale);

        cells.forEach(function(row, rdx) {
            row.forEach(function(cell, cdx) {
                ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
                const w =
                    Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
                const h =
                    Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
                ctx &&
                    ctx.fillRect(
                        Math.round(cdx * tileW),
                        Math.round(rdx * tileH),
                        w,
                        h
                    );
            });
        });

        ctx.draw();
    }

    render() {
        const { QRid, size } = this.props;
        const canvasStyle = {
            height: size + 'px',
            width: size + 'px'
        };
        return <Canvas canvasId={QRid} style={canvasStyle} />;
    }
}
