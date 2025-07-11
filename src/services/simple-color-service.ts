// Simple color service that works in Shadow DOM contexts
// No external dependencies, just basic color generation

export interface SimpleColor {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
}

export interface SimpleColorGeneratorServiceInterface {
    getTriad(color: SimpleColor, spin?: number): SimpleColor[];
    getSplitComponent(color: SimpleColor, spin?: number): SimpleColor[];
    getTetrad(color: SimpleColor, spin?: number): SimpleColor[];
    getDefaultTriad(startingIndex?: number): SimpleColor[];
    getDefaultSplitComponent(startingIndex?: number): SimpleColor[];
    getDefaultTetrad(startingIndex?: number): SimpleColor[];
}

// Predefined color palettes
const DEFAULT_COLORS = [
    { hex: '#FF6B6B', rgb: { r: 255, g: 107, b: 107 }, hsl: { h: 0, s: 100, l: 71 } },
    { hex: '#4ECDC4', rgb: { r: 78, g: 205, b: 196 }, hsl: { h: 175, s: 47, l: 55 } },
    { hex: '#45B7D1', rgb: { r: 69, g: 183, b: 209 }, hsl: { h: 194, s: 55, l: 55 } },
    { hex: '#96CEB4', rgb: { r: 150, g: 206, b: 180 }, hsl: { h: 150, s: 39, l: 70 } },
    { hex: '#FFEAA7', rgb: { r: 255, g: 234, b: 167 }, hsl: { h: 48, s: 100, l: 83 } },
    { hex: '#DDA0DD', rgb: { r: 221, g: 160, b: 221 }, hsl: { h: 300, s: 47, l: 75 } },
    { hex: '#98D8C8', rgb: { r: 152, g: 216, b: 200 }, hsl: { h: 165, s: 44, l: 72 } },
    { hex: '#F7DC6F', rgb: { r: 247, g: 220, b: 111 }, hsl: { h: 49, s: 90, l: 70 } }
];

// Simple color utilities
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

const spinHue = (color: SimpleColor, degrees: number): SimpleColor => {
    const newH = (color.hsl.h + degrees) % 360;
    const rgb = hslToRgb(newH, color.hsl.s, color.hsl.l);
    return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { h: newH, s: color.hsl.s, l: color.hsl.l }
    };
};

export class SimpleColorGeneratorService implements SimpleColorGeneratorServiceInterface {
    getTriad(color: SimpleColor, spin: number = 0): SimpleColor[] {
        const baseColor = spinHue(color, spin);
        return [
            baseColor,
            spinHue(baseColor, 120),
            spinHue(baseColor, 240)
        ];
    }

    getSplitComponent(color: SimpleColor, spin: number = 0): SimpleColor[] {
        const baseColor = spinHue(color, spin);
        return [
            baseColor,
            spinHue(baseColor, 150),
            spinHue(baseColor, 210)
        ];
    }

    getTetrad(color: SimpleColor, spin: number = 0): SimpleColor[] {
        const baseColor = spinHue(color, spin);
        return [
            baseColor,
            spinHue(baseColor, 90),
            spinHue(baseColor, 180),
            spinHue(baseColor, 270)
        ];
    }

    getDefaultTriad(startingIndex: number = Math.floor(Math.random() * DEFAULT_COLORS.length)): SimpleColor[] {
        const baseColor = DEFAULT_COLORS[startingIndex % DEFAULT_COLORS.length];
        return this.getTriad(baseColor);
    }

    getDefaultSplitComponent(startingIndex: number = Math.floor(Math.random() * DEFAULT_COLORS.length)): SimpleColor[] {
        const baseColor = DEFAULT_COLORS[startingIndex % DEFAULT_COLORS.length];
        return this.getSplitComponent(baseColor);
    }

    getDefaultTetrad(startingIndex: number = Math.floor(Math.random() * DEFAULT_COLORS.length)): SimpleColor[] {
        const baseColor = DEFAULT_COLORS[startingIndex % DEFAULT_COLORS.length];
        return this.getTetrad(baseColor);
    }
}

// Compatibility adapter for existing SelectorHierarchy interface
export class SimpleColorServiceAdapter {
    private simpleService: SimpleColorGeneratorService;

    constructor() {
        this.simpleService = new SimpleColorGeneratorService();
    }

    // Create a mock tinycolor instance that works with the existing interface
    private createMockTinyColor(color: SimpleColor): any {
        return {
            spin: (degrees: number) => {
                const spunColor = spinHue(color, degrees);
                return this.createMockTinyColor(spunColor);
            },
            triad: () => {
                const triad = this.simpleService.getTriad(color);
                return triad.map(c => this.createMockTinyColor(c));
            },
            splitcomplement: () => {
                const split = this.simpleService.getSplitComponent(color);
                return split.map(c => this.createMockTinyColor(c));
            },
            tetrad: () => {
                const tetrad = this.simpleService.getTetrad(color);
                return tetrad.map(c => this.createMockTinyColor(c));
            },
            toHexString: () => color.hex,
            toRgbString: () => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
            toHslString: () => `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
        };
    }

    getTriad(color: any, spin: number = 0): any[] {
        const simpleColor = this.tinyColorToSimpleColor(color);
        const triad = this.simpleService.getTriad(simpleColor, spin);
        return triad.map(c => this.createMockTinyColor(c));
    }

    getSplitComponent(color: any, spin: number = 0): any[] {
        const simpleColor = this.tinyColorToSimpleColor(color);
        const split = this.simpleService.getSplitComponent(simpleColor, spin);
        return split.map(c => this.createMockTinyColor(c));
    }

    getTetrad(color: any, spin: number = 0): any[] {
        const simpleColor = this.tinyColorToSimpleColor(color);
        const tetrad = this.simpleService.getTetrad(simpleColor, spin);
        return tetrad.map(c => this.createMockTinyColor(c));
    }

    getDefaultTriad(startingIndex: number = Math.floor(Math.random() * DEFAULT_COLORS.length)): any[] {
        const triad = this.simpleService.getDefaultTriad(startingIndex);
        return triad.map(c => this.createMockTinyColor(c));
    }

    getDefaultSplitComponent(startingIndex: number = Math.floor(Math.random() * DEFAULT_COLORS.length)): any[] {
        const split = this.simpleService.getDefaultSplitComponent(startingIndex);
        return split.map(c => this.createMockTinyColor(c));
    }

    getDefaultTetrad(startingIndex: number = Math.floor(Math.random() * DEFAULT_COLORS.length)): any[] {
        const tetrad = this.simpleService.getDefaultTetrad(startingIndex);
        return tetrad.map(c => this.createMockTinyColor(c));
    }

    private tinyColorToSimpleColor(color: any): SimpleColor {
        // If it's already a SimpleColor, return it
        if (color.hex && color.rgb && color.hsl) {
            return color;
        }
        
        // If it's a tinycolor instance, extract the color
        if (color.toHexString) {
            const hex = color.toHexString();
            // Parse hex to RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const hsl = rgbToHsl(r, g, b);
            return { hex, rgb: { r, g, b }, hsl };
        }
        
        // Default fallback
        return DEFAULT_COLORS[0];
    }
} 