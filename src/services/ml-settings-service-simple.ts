import Options from '../models/options';
import Wave from '../models/wave';

export interface UserBehaviorPattern {
    timestamp: number;
    domain: string;
    path: string;
    selector: string;
    settings: Partial<Options>;
    success: boolean;
    duration: number;
    userRating: number;
}

export interface MLSettingsRecommendation {
    confidence: number;
    settings: Partial<Options>;
    reasoning: string[];
    similarPatterns: number;
    isDefault: boolean;
    respectsUserSettings: boolean;
}

export class MLSettingsService {
    private behaviorPatterns: UserBehaviorPattern[] = [];
    private artificialWeightMultiplier = 3; // Heavily weight artificial defaults

    constructor() {
        this.initializeArtificialDefaults();
    }

    private initializeArtificialDefaults(): void {
        const artificialPatterns: UserBehaviorPattern[] = [
            {
                timestamp: Date.now(),
                domain: 'news.example.com',
                path: '/article',
                selector: 'p, h1, h2, h3, .content, .article-body',
                settings: {
                    wave: new Wave({
                        selector: 'p, h1, h2, h3, .content, .article-body',
                        waveSpeed: 3,
                        axisTranslateAmountXMax: 1,
                        axisTranslateAmountXMin: -1,
                        axisRotationAmountYMax: 2,
                        axisRotationAmountYMin: -2,
                        mouseFollowInterval: 80
                    }),
                    showNotifications: true,
                    selectors: ['p', 'h1', 'h2', 'h3', '.content', '.article-body']
                },
                success: true,
                duration: 5000,
                userRating: 5
            },
            {
                timestamp: Date.now(),
                domain: 'blog.example.com',
                path: '/post',
                selector: 'article p, .post-content, .entry-content',
                settings: {
                    wave: new Wave({
                        selector: 'article p, .post-content, .entry-content',
                        waveSpeed: 2.5,
                        axisTranslateAmountXMax: 0.8,
                        axisTranslateAmountXMin: -0.8,
                        axisRotationAmountYMax: 1.5,
                        axisRotationAmountYMin: -1.5,
                        mouseFollowInterval: 100
                    }),
                    showNotifications: true,
                    selectors: ['article p', '.post-content', '.entry-content']
                },
                success: true,
                duration: 4000,
                userRating: 4
            },
            {
                timestamp: Date.now(),
                domain: 'docs.example.com',
                path: '/manual',
                selector: 'p, li, .documentation, .guide',
                settings: {
                    wave: new Wave({
                        selector: 'p, li, .documentation, .guide',
                        waveSpeed: 4,
                        axisTranslateAmountXMax: 1.2,
                        axisTranslateAmountXMin: -1.2,
                        axisRotationAmountYMax: 2.5,
                        axisRotationAmountYMin: -2.5,
                        mouseFollowInterval: 60
                    }),
                    showNotifications: false,
                    selectors: ['p', 'li', '.documentation', '.guide']
                },
                success: true,
                duration: 6000,
                userRating: 5
            },
            {
                timestamp: Date.now(),
                domain: 'ecommerce.example.com',
                path: '/product',
                selector: '.product-description, .details, .specs',
                settings: {
                    wave: new Wave({
                        selector: '.product-description, .details, .specs',
                        waveSpeed: 2,
                        axisTranslateAmountXMax: 0.6,
                        axisTranslateAmountXMin: -0.6,
                        axisRotationAmountYMax: 1.8,
                        axisRotationAmountYMin: -1.8,
                        mouseFollowInterval: 120
                    }),
                    showNotifications: true,
                    selectors: ['.product-description', '.details', '.specs']
                },
                success: true,
                duration: 3500,
                userRating: 4
            },
            {
                timestamp: Date.now(),
                domain: 'social.example.com',
                path: '/feed',
                selector: '.post, .tweet, .status, .update',
                settings: {
                    wave: new Wave({
                        selector: '.post, .tweet, .status, .update',
                        waveSpeed: 1.8,
                        axisTranslateAmountXMax: 0.5,
                        axisTranslateAmountXMin: -0.5,
                        axisRotationAmountYMax: 1.2,
                        axisRotationAmountYMin: -1.2,
                        mouseFollowInterval: 150
                    }),
                    showNotifications: true,
                    selectors: ['.post', '.tweet', '.status', '.update']
                },
                success: true,
                duration: 3000,
                userRating: 3
            }
        ];

        // Heavily weight artificial defaults by adding them multiple times
        artificialPatterns.forEach(pattern => {
            for (let i = 0; i < this.artificialWeightMultiplier; i++) {
                this.behaviorPatterns.push({
                    ...pattern,
                    timestamp: pattern.timestamp + i * 1000
                });
            }
        });
    }

    async getSettingsRecommendations(
        domain: string,
        path: string = '/',
        selector: string = 'p',
        existingSettings?: Partial<Options>,
        forceReset: boolean = false
    ): Promise<MLSettingsRecommendation[]> {
        try {
            // Record this behavior pattern
            const newPattern: UserBehaviorPattern = {
                timestamp: Date.now(),
                domain,
                path,
                selector,
                settings: existingSettings || {},
                success: true,
                duration: 0,
                userRating: 0
            };
            this.behaviorPatterns.push(newPattern);

            // Find similar patterns
            const similarPatterns = this.findSimilarPatterns(domain, path, selector);
            
            if (similarPatterns.length === 0) {
                return [this.getFallbackRecommendation(domain, path, selector)];
            }

            // Group patterns by settings similarity
            const groupedPatterns = this.groupPatternsBySettings(similarPatterns);
            
            // Generate recommendations
            const recommendations: MLSettingsRecommendation[] = [];
            
            for (const [settingsKey, patterns] of groupedPatterns) {
                const confidence = this.calculateConfidence(patterns);
                const averageSettings = this.averageSettings(patterns);
                const reasoning = this.generateReasoning(patterns, domain, path);
                
                // Check if this recommendation respects user settings
                const respectsUserSettings = existingSettings && !forceReset ? 
                    this.respectsUserSettings(averageSettings, existingSettings) : true;
                
                recommendations.push({
                    confidence,
                    settings: averageSettings,
                    reasoning,
                    similarPatterns: patterns.length,
                    isDefault: false,
                    respectsUserSettings
                });
            }

            // Sort by confidence and respect for user settings
            recommendations.sort((a, b) => {
                if (a.respectsUserSettings && !b.respectsUserSettings) return -1;
                if (!a.respectsUserSettings && b.respectsUserSettings) return 1;
                return b.confidence - a.confidence;
            });

            return recommendations;

        } catch (error) {
            console.error('Error getting ML settings recommendations:', error);
            return [this.getFallbackRecommendation(domain, path, selector)];
        }
    }

    private findSimilarPatterns(domain: string, path: string, selector: string): UserBehaviorPattern[] {
        return this.behaviorPatterns
            .filter(pattern => pattern.success && pattern.userRating >= 3)
            .sort((a, b) => {
                const similarityA = this.calculateSimilarity(domain, path, selector, a);
                const similarityB = this.calculateSimilarity(domain, path, selector, b);
                return similarityB - similarityA;
            })
            .slice(0, 10); // Top 10 most similar patterns
    }

    private calculateSimilarity(domain: string, path: string, selector: string, pattern: UserBehaviorPattern): number {
        const domainSimilarity = this.calculateDomainSimilarity(domain, pattern.domain);
        const pathSimilarity = this.calculatePathSimilarity(path, pattern.path);
        const selectorSimilarity = this.calculateSelectorSimilarity(selector, pattern.selector);
        
        // Weight domain similarity highest, then path, then selector
        return (domainSimilarity * 0.5) + (pathSimilarity * 0.3) + (selectorSimilarity * 0.2);
    }

    private calculateDomainSimilarity(domain1: string, domain2: string): number {
        if (domain1 === domain2) return 1.0;
        
        const parts1 = domain1.split('.');
        const parts2 = domain2.split('.');
        
        // Check if they share the same TLD and main domain
        if (parts1.length >= 2 && parts2.length >= 2) {
            if (parts1[parts1.length - 1] === parts2[parts2.length - 1] && 
                parts1[parts1.length - 2] === parts2[parts2.length - 2]) {
                return 0.8;
            }
        }
        
        // Check if they share the same main domain
        if (parts1.length >= 2 && parts2.length >= 2) {
            if (parts1[parts1.length - 2] === parts2[parts2.length - 2]) {
                return 0.6;
            }
        }
        
        return 0.0;
    }

    private calculatePathSimilarity(path1: string, path2: string): number {
        if (path1 === path2) return 1.0;
        
        const segments1 = path1.split('/').filter(s => s.length > 0);
        const segments2 = path2.split('/').filter(s => s.length > 0);
        
        if (segments1.length === 0 && segments2.length === 0) return 1.0;
        if (segments1.length === 0 || segments2.length === 0) return 0.0;
        
        const commonSegments = segments1.filter(s => segments2.includes(s));
        return commonSegments.length / Math.max(segments1.length, segments2.length);
    }

    private calculateSelectorSimilarity(selector1: string, selector2: string): number {
        if (selector1 === selector2) return 1.0;
        
        const selectors1 = selector1.split(',').map(s => s.trim());
        const selectors2 = selector2.split(',').map(s => s.trim());
        
        const commonSelectors = selectors1.filter(s => selectors2.includes(s));
        return commonSelectors.length / Math.max(selectors1.length, selectors2.length);
    }

    private groupPatternsBySettings(patterns: UserBehaviorPattern[]): Map<string, UserBehaviorPattern[]> {
        const groups = new Map<string, UserBehaviorPattern[]>();
        
        patterns.forEach(pattern => {
            const key = this.generateSettingsKey(pattern.settings);
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key)!.push(pattern);
        });
        
        return groups;
    }

    private generateSettingsKey(settings: Partial<Options>): string {
        const wave = settings.wave;
        if (!wave) return 'default';
        
        return [
            wave.waveSpeed?.toFixed(1) || '0',
            wave.axisTranslateAmountXMax?.toFixed(1) || '0',
            wave.axisTranslateAmountXMin?.toFixed(1) || '0',
            wave.axisRotationAmountYMax?.toFixed(1) || '0',
            wave.axisRotationAmountYMin?.toFixed(1) || '0',
            wave.mouseFollowInterval?.toString() || '0'
        ].join('|');
    }

    private areSettingsSimilar(settings1: Partial<Options>, settings2: Partial<Options>): boolean {
        const wave1 = settings1.wave;
        const wave2 = settings2.wave;
        
        if (!wave1 || !wave2) return false;
        
        const tolerance = 0.5;
        
        if (Math.abs((wave1.waveSpeed || 0) - (wave2.waveSpeed || 0)) > tolerance) return false;
        if (Math.abs((wave1.axisTranslateAmountXMax || 0) - (wave2.axisTranslateAmountXMax || 0)) > tolerance) return false;
        if (Math.abs((wave1.axisTranslateAmountXMin || 0) - (wave2.axisTranslateAmountXMin || 0)) > tolerance) return false;
        if (Math.abs((wave1.axisRotationAmountYMax || 0) - (wave2.axisRotationAmountYMax || 0)) > tolerance) return false;
        if (Math.abs((wave1.axisRotationAmountYMin || 0) - (wave2.axisRotationAmountYMin || 0)) > tolerance) return false;
        if (Math.abs((wave1.mouseFollowInterval || 0) - (wave2.mouseFollowInterval || 0)) > 10) return false;
        
        return true;
    }

    private calculateConfidence(patterns: UserBehaviorPattern[]): number {
        if (patterns.length === 0) return 0;
        
        const avgRating = patterns.reduce((sum, p) => sum + p.userRating, 0) / patterns.length;
        const avgDuration = patterns.reduce((sum, p) => sum + p.duration, 0) / patterns.length;
        const successRate = patterns.filter(p => p.success).length / patterns.length;
        
        // Normalize values
        const normalizedRating = avgRating / 5;
        const normalizedDuration = Math.min(avgDuration / 10000, 1); // Cap at 10 seconds
        const normalizedSuccess = successRate;
        
        // Weight factors
        const ratingWeight = 0.4;
        const durationWeight = 0.3;
        const successWeight = 0.3;
        
        return (normalizedRating * ratingWeight) + 
               (normalizedDuration * durationWeight) + 
               (normalizedSuccess * successWeight);
    }

    private averageSettings(patterns: UserBehaviorPattern[]): Partial<Options> {
        if (patterns.length === 0) return {};
        
        const waveSettings = patterns.map(p => p.settings.wave).filter(Boolean) as Partial<Wave>[];
        
        if (waveSettings.length === 0) return {};
        
        const avgSettings: Partial<Options> = {
            wave: new Wave({
                waveSpeed: this.average(waveSettings.map(w => w.waveSpeed).filter(Boolean) as number[]),
                axisTranslateAmountXMax: this.average(waveSettings.map(w => w.axisTranslateAmountXMax).filter(Boolean) as number[]),
                axisTranslateAmountXMin: this.average(waveSettings.map(w => w.axisTranslateAmountXMin).filter(Boolean) as number[]),
                axisRotationAmountYMax: this.average(waveSettings.map(w => w.axisRotationAmountYMax).filter(Boolean) as number[]),
                axisRotationAmountYMin: this.average(waveSettings.map(w => w.axisRotationAmountYMin).filter(Boolean) as number[]),
                mouseFollowInterval: this.average(waveSettings.map(w => w.mouseFollowInterval).filter(Boolean) as number[])
            }),
            showNotifications: this.mostCommon(patterns.map(p => p.settings.showNotifications).filter(Boolean) as boolean[]),
            selectors: this.mostCommon(patterns.map(p => p.settings.selectors).filter(Boolean) as string[][])
        };
        
        return avgSettings;
    }

    private average(numbers: number[]): number {
        if (numbers.length === 0) return 0;
        return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    }

    private mostCommon<T>(items: T[]): T | undefined {
        if (items.length === 0) return undefined;
        
        const counts = new Map<T, number>();
        items.forEach(item => {
            counts.set(item, (counts.get(item) || 0) + 1);
        });
        
        let mostCommon: T | undefined;
        let maxCount = 0;
        
        counts.forEach((count, item) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = item;
            }
        });
        
        return mostCommon;
    }

    private generateReasoning(patterns: UserBehaviorPattern[], domain: string, path: string): string[] {
        const reasons: string[] = [];
        
        if (patterns.length > 0) {
            reasons.push(`Based on ${patterns.length} similar usage patterns`);
            
            const avgRating = patterns.reduce((sum, p) => sum + p.userRating, 0) / patterns.length;
            if (avgRating >= 4) {
                reasons.push('High user satisfaction with similar settings');
            }
            
            const domainPatterns = patterns.filter(p => this.calculateDomainSimilarity(domain, p.domain) > 0.8);
            if (domainPatterns.length > 0) {
                reasons.push(`Settings optimized for similar domains (${domainPatterns.length} patterns)`);
            }
        }
        
        return reasons;
    }

    private respectsUserSettings(mlSettings: Partial<Options>, userSettings: Partial<Options>): boolean {
        const wave1 = mlSettings.wave;
        const wave2 = userSettings.wave;
        
        if (!wave1 || !wave2) return true;
        
        // Check if ML settings are significantly different from user settings
        if (Math.abs((wave1.waveSpeed || 0) - (wave2.waveSpeed || 0)) > 0.5) {
            return false;
        }
        
        if (Math.abs((wave1.axisTranslateAmountXMax || 0) - (wave2.axisTranslateAmountXMax || 0)) > 0.3) {
            return false;
        }
        
        if (Math.abs((wave1.axisRotationAmountYMax || 0) - (wave2.axisRotationAmountYMax || 0)) > 0.3) {
            return false;
        }
        
        // Check if ML selector is more comprehensive
        if (wave1.selector && wave2.selector && 
            this.isSelectorMoreComprehensive(wave1.selector, wave2.selector)) {
            return false;
        }
        
        return true;
    }

    private isSelectorMoreComprehensive(selector1: string, selector2: string): boolean {
        const selectors1 = selector1.split(',').map(s => s.trim());
        const selectors2 = selector2.split(',').map(s => s.trim());
        
        // Check if selector1 covers more elements
        const coverage1 = selectors1.length;
        const coverage2 = selectors2.length;
        
        return coverage1 > coverage2;
    }

    private getFallbackRecommendation(domain: string, path: string, selector: string): MLSettingsRecommendation {
        // Generate domain-specific fallback settings
        const domainType = this.classifyDomain(domain);
        
        let fallbackSettings: Partial<Options> = {};
        
        switch (domainType) {
            case 'news':
                                 fallbackSettings = {
                     wave: new Wave({
                         selector,
                         waveSpeed: 3,
                         axisTranslateAmountXMax: 1,
                         axisTranslateAmountXMin: -1,
                         axisRotationAmountYMax: 2,
                         axisRotationAmountYMin: -2,
                         mouseFollowInterval: 80
                     }),
                    showNotifications: true,
                    selectors: [selector]
                };
                break;
                
            case 'blog':
                fallbackSettings = {
                    wave: new Wave({
                        selector,
                        waveSpeed: 2.5,
                        axisTranslateAmountXMax: 0.8,
                        axisTranslateAmountXMin: -0.8,
                        axisRotationAmountYMax: 1.5,
                        axisRotationAmountYMin: -1.5,
                        mouseFollowInterval: 100
                    }),
                    showNotifications: true,
                    selectors: [selector]
                };
                break;
                
            case 'documentation':
                fallbackSettings = {
                    wave: new Wave({
                        selector,
                        waveSpeed: 4,
                        axisTranslateAmountXMax: 1.2,
                        axisTranslateAmountXMin: -1.2,
                        axisRotationAmountYMax: 2.5,
                        axisRotationAmountYMin: -2.5,
                        mouseFollowInterval: 60
                    }),
                    showNotifications: false,
                    selectors: [selector]
                };
                break;
                
            default:
                fallbackSettings = {
                    wave: new Wave({
                        selector,
                        waveSpeed: 2.5,
                        axisTranslateAmountXMax: 0.8,
                        axisTranslateAmountXMin: -0.8,
                        axisRotationAmountYMax: 1.5,
                        axisRotationAmountYMin: -1.5,
                        mouseFollowInterval: 100
                    }),
                    showNotifications: true,
                    selectors: [selector]
                };
        }
        
        return {
            confidence: 0.3,
            settings: fallbackSettings,
            reasoning: ['Fallback settings based on domain classification'],
            similarPatterns: 0,
            isDefault: true,
            respectsUserSettings: true
        };
    }

    private classifyDomain(domain: string): string {
        const domainLower = domain.toLowerCase();
        
        if (domainLower.includes('news') || domainLower.includes('article')) return 'news';
        if (domainLower.includes('blog') || domainLower.includes('post')) return 'blog';
        if (domainLower.includes('docs') || domainLower.includes('manual') || domainLower.includes('guide')) return 'documentation';
        if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('product')) return 'ecommerce';
        if (domainLower.includes('social') || domainLower.includes('feed') || domainLower.includes('twitter')) return 'social';
        
        return 'general';
    }

    // Public methods for external use
    async recordBehaviorPattern(pattern: UserBehaviorPattern): Promise<void> {
        this.behaviorPatterns.push(pattern);
    }

    async getMLStats(): Promise<{
        totalPatterns: number;
        artificialPatterns: number;
        userPatterns: number;
        averageConfidence: number;
    }> {
        const artificialCount = this.behaviorPatterns.length - (this.behaviorPatterns.length / (this.artificialWeightMultiplier + 1));
        const userCount = this.behaviorPatterns.length - artificialCount;
        
        return {
            totalPatterns: this.behaviorPatterns.length,
            artificialPatterns: Math.round(artificialCount),
            userPatterns: Math.round(userCount),
            averageConfidence: this.calculateAverageConfidence()
        };
    }

    private calculateAverageConfidence(): number {
        if (this.behaviorPatterns.length === 0) return 0;
        
        const confidences = this.behaviorPatterns.map(pattern => {
            const similarPatterns = this.findSimilarPatterns(
                pattern.domain, 
                pattern.path, 
                pattern.selector
            );
            return this.calculateConfidence(similarPatterns);
        });
        
        return this.average(confidences);
    }
}

export default MLSettingsService;
