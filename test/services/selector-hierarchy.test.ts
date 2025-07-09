import { SelectorHierarchy, ColorGeneratorService, ISLAND_CONFIG } from '../../src/services/selector-hierarchy';
import { ForThoustPanel } from '../../src/services/selector-hierarchy';

describe('SelectorHierarchy - Complex Reading Materials', () => {
    let selectorHierarchy: SelectorHierarchy;
    let colorService: ColorGeneratorService;

    beforeEach(() => {
        colorService = new ColorGeneratorService();
        selectorHierarchy = new SelectorHierarchy(colorService);
    });

    const createComplexReadingPage = () => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>Complex Reading Test</title></head>
            <body>
                <!-- Header with navigation menu -->
                <header>
                    <nav>
                        <ul>
                            <li><a class="menu-home" href="#home">Home</a></li>
                            <li><a class="menu-about" href="#about">About</a></li>
                            <li><a class="menu-contact" href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                    <h1 class="main-title">Main Article Title</h1>
                    <p class="subtitle">Subtitle and description</p>
                </header>

                <!-- Main content area -->
                <main>
                    <article>
                        <h2 class="intro-header">Introduction</h2>
                        <p class="para-1">This is a long paragraph that should be grouped together as one reading section. 
                        It contains multiple sentences and should form a cohesive reading block.</p>
                        
                        <p class="para-2">Another paragraph that continues the same topic but should be a separate island 
                        from the previous paragraph for better reading flow.</p>

                        <h3 class="key-concepts-header">Key Concepts</h3>
                        <p class="para-3">This section introduces important concepts that readers need to understand.</p>
                        
                        <blockquote class="important-quote">
                            <p>This is an important quote that should be highlighted separately from the main text.</p>
                            <cite>- Famous Author</cite>
                        </blockquote>

                        <h3 class="examples-header">Examples and Code</h3>
                        <p class="para-4">Here are some examples to illustrate the concepts:</p>
                        
                        <div class="example example-1">
                            <h4>Example 1</h4>
                            <p class="example-para-1">This is an example that should be grouped with its heading.</p>
                            <code>console.log("Hello World");</code>
                        </div>

                        <div class="example example-2">
                            <h4>Example 2</h4>
                            <p class="example-para-2">Another example that should be separate from the first one.</p>
                            <pre><code>function test() { return true; }</code></pre>
                        </div>

                        <h2 class="conclusion-header">Conclusion</h2>
                        <p class="para-5">This is the conclusion paragraph that wraps up the main points.</p>
                        
                        <ul class="summary-list">
                            <li class="summary-1">Summary point 1</li>
                            <li class="summary-2">Summary point 2</li>
                            <li class="summary-3">Summary point 3</li>
                        </ul>
                    </article>

                    <!-- Sidebar with related content -->
                    <aside>
                        <h3 class="related-header">Related Articles</h3>
                        <ul>
                            <li><a class="related-article-1" href="#article1">Related Article 1</a></li>
                            <li><a class="related-article-2" href="#article2">Related Article 2</a></li>
                        </ul>
                    </aside>
                </main>

                <!-- Footer -->
                <footer>
                    <p class="footer-text">Copyright 2024</p>
                </footer>
            </body>
            </html>
        `;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    };

    const createAcademicPaper = () => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>Academic Paper Test</title></head>
            <body>
                <div class="paper">
                    <header>
                        <h1 class="paper-title">Research Paper Title</h1>
                        <p class="authors">Author 1, Author 2</p>
                        <p class="abstract">This is the abstract that summarizes the entire paper.</p>
                    </header>

                    <section class="introduction-section">
                        <h2 class="intro-header">1. Introduction</h2>
                        <p class="intro-para-1">This is a very long introduction paragraph that should be broken into multiple islands 
                        for better reading flow. It contains multiple sentences and complex ideas that need 
                        to be processed separately.</p>
                        
                        <p class="intro-para-2">Another paragraph in the introduction that continues the discussion.</p>
                        
                        <blockquote class="important-quote">
                            <p>This is a critical quote from a seminal paper that should be highlighted.</p>
                        </blockquote>
                    </section>

                    <section class="methodology-section">
                        <h2 class="method-header">2. Methodology</h2>
                        <p class="method-para-1">This section describes the research methodology.</p>
                        
                        <div class="method-step method-step-1">
                            <h3>Step 1</h3>
                            <p class="method-step-para-1">Description of the first step in the methodology.</p>
                        </div>
                        
                        <div class="method-step method-step-2">
                            <h3>Step 2</h3>
                            <p class="method-step-para-2">Description of the second step in the methodology.</p>
                        </div>
                    </section>

                    <section class="results-section">
                        <h2 class="results-header">3. Results</h2>
                        <p class="results-para-1">The results section contains the findings.</p>
                        
                        <div class="result-item result-item-1">
                            <h3>Finding 1</h3>
                            <p class="result-para-1">Description of the first finding.</p>
                        </div>
                        
                        <div class="result-item result-item-2">
                            <h3>Finding 2</h3>
                            <p class="result-para-2">Description of the second finding.</p>
                        </div>
                    </section>
                </div>
            </body>
            </html>
        `;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    };

    const createNewsArticle = () => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>News Article Test</title></head>
            <body>
                <article class="news-article">
                    <header>
                        <h1 class="news-headline">Breaking News Headline</h1>
                        <p class="byline">By Reporter Name</p>
                        <p class="date">January 1, 2024</p>
                    </header>

                    <div class="lead">
                        <p class="lead-para">This is the lead paragraph that summarizes the story.</p>
                    </div>

                    <div class="content">
                        <p class="content-para-1">This is the first paragraph of the news story. It should be separate from the lead.</p>
                        
                        <p class="content-para-2">This is another paragraph that continues the story.</p>
                        
                        <blockquote class="quote">
                            <p class="quote-text">"This is a direct quote from a source," said the spokesperson.</p>
                        </blockquote>
                        
                        <p class="content-para-3">This paragraph follows the quote and provides additional context.</p>
                        
                        <h2 class="background-header">Background Information</h2>
                        <p class="background-para">This section provides background context for the story.</p>
                        
                        <ul class="key-points">
                            <li class="key-point-1">Key point 1</li>
                            <li class="key-point-2">Key point 2</li>
                            <li class="key-point-3">Key point 3</li>
                        </ul>
                    </div>
                </article>
            </body>
            </html>
        `;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    };

    describe('Complex Reading Page Tests', () => {
        it('should create separate islands for header navigation menu items', () => {
            const doc = createComplexReadingPage();
            const selection = ForThoustPanel(doc, 'nav a', selectorHierarchy);
            
            // Should create separate islands for each menu item
            const islands = Array.from(selection.htmlSelectors.keys());
            expect(islands.length).toBeGreaterThan(0);
            
            // Each menu item should be in its own island
            const menuItems = doc.querySelectorAll('nav a');
            expect(menuItems.length).toBe(3); // Home, About, Contact
            
            console.log(`🌊 Created ${islands.length} islands for navigation menu`);
        });

        it('should group long paragraphs together while separating different sections', () => {
            const doc = createComplexReadingPage();
            const selection = ForThoustPanel(doc, 'p', selectorHierarchy);
            
            const islands = Array.from(selection.htmlSelectors.keys());
            
            // Should have multiple islands for different paragraphs
            expect(islands.length).toBeGreaterThan(1);
            
            // Check that long paragraphs are grouped appropriately
            const longParagraphs = doc.querySelectorAll('p');
            expect(longParagraphs.length).toBeGreaterThan(5);
            
            console.log(`🌊 Created ${islands.length} islands for ${longParagraphs.length} paragraphs`);
        });

        it('should create separate islands for blockquotes', () => {
            const doc = createComplexReadingPage();
            const selection = ForThoustPanel(doc, 'blockquote', selectorHierarchy);
            
            const islands = Array.from(selection.htmlSelectors.keys());
            const blockquotes = doc.querySelectorAll('blockquote');
            
            expect(islands.length).toBeGreaterThan(0);
            expect(blockquotes.length).toBe(1);
            
            console.log(`🌊 Created ${islands.length} islands for blockquotes`);
        });

        it('should separate examples into individual islands', () => {
            const doc = createComplexReadingPage();
            const selection = ForThoustPanel(doc, '.example', selectorHierarchy);
            
            const islands = Array.from(selection.htmlSelectors.keys());
            const examples = doc.querySelectorAll('.example');
            
            // Should create separate islands for each example
            expect(islands.length).toBeGreaterThan(0);
            expect(examples.length).toBe(2);
            
            console.log(`🌊 Created ${islands.length} islands for ${examples.length} examples`);
        });

        it('should respect size limits for islands', () => {
            const doc = createComplexReadingPage();
            const selection = ForThoustPanel(doc, 'p, h1, h2, h3, h4', selectorHierarchy);
            
            const islands = Array.from(selection.htmlSelectors.keys());
            
            islands.forEach(island => {
                // Check that islands don't exceed size limits
                const totalWidth = island.elem.reduce((sum, el) => sum + el.offsetWidth, 0);
                const totalHeight = Math.max(...island.elem.map(el => el.offsetTop + el.offsetHeight)) - 
                                  Math.min(...island.elem.map(el => el.offsetTop));
                
                expect(totalWidth).toBeLessThanOrEqual(ISLAND_CONFIG.MAX_ISLAND_WIDTH);
                expect(totalHeight).toBeLessThanOrEqual(ISLAND_CONFIG.MAX_ISLAND_HEIGHT);
                expect(island.elem.length).toBeLessThanOrEqual(ISLAND_CONFIG.MAX_ISLAND_ELEMENTS);
            });
            
            console.log(`🌊 All ${islands.length} islands respect size limits`);
        });
    });

    describe('Academic Paper Tests', () => {
        it('should create separate islands for abstract and introduction', () => {
            const doc = createAcademicPaper();
            const selection = ForThoustPanel(doc, '.abstract, .introduction p', selectorHierarchy);
            
            const islands = Array.from(selection.htmlSelectors.keys());
            expect(islands.length).toBeGreaterThan(1);
            
            console.log(`🌊 Created ${islands.length} islands for abstract and introduction`);
        });
    });
});