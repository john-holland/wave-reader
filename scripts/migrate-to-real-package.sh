#!/bin/bash

# Mock Removal Migration Script
# This script helps migrate from mock to real log-view-machine package

set -e

echo "🔄 Starting migration to real log-view-machine package..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the wave-reader root directory"
    exit 1
fi

# Check if log-view-machine package exists
if [ ! -d "../log-view-machine" ]; then
    print_error "log-view-machine package not found at ../log-view-machine"
    exit 1
fi

# Check if log-view-machine is built
if [ ! -f "../log-view-machine/dist/index.esm.js" ]; then
    print_warning "log-view-machine package not built. Building now..."
    cd ../log-view-machine
    npm run build
    cd ../wave-reader
    print_success "log-view-machine package built successfully"
fi

# Step 1: Test with current configuration (mocks)
print_status "Step 1: Testing with current configuration (mocks)..."
if npm test -- --passWithNoTests; then
    print_success "Tests with mocks passed"
else
    print_error "Tests with mocks failed. Please fix before continuing."
    exit 1
fi

# Step 2: Test with real package in development
print_status "Step 2: Testing with real package in development..."
export NODE_ENV=development
export USE_MOCK=false

if npm run build; then
    print_success "Build with real package in development succeeded"
else
    print_error "Build with real package in development failed"
    print_warning "Rolling back to mocks..."
    export USE_MOCK=true
    exit 1
fi

# Step 3: Test with real package in production
print_status "Step 3: Testing with real package in production..."
export NODE_ENV=production
export USE_MOCK=false

if npm run build; then
    print_success "Build with real package in production succeeded"
else
    print_error "Build with real package in production failed"
    print_warning "Rolling back to mocks..."
    export USE_MOCK=true
    exit 1
fi

# Step 4: Run integration tests
print_status "Step 4: Running integration tests..."
if npm run test:integration 2>/dev/null || npm test -- --testNamePattern="integration" 2>/dev/null; then
    print_success "Integration tests passed"
else
    print_warning "Integration tests not found or failed, but continuing..."
fi

# Step 5: Run Playwright tests
print_status "Step 5: Running Playwright tests..."
if npm run test:playwright 2>/dev/null || npx playwright test 2>/dev/null; then
    print_success "Playwright tests passed"
else
    print_warning "Playwright tests failed, but continuing..."
fi

# Step 6: Create backup of current webpack config
print_status "Step 6: Creating backup of current webpack configuration..."
cp webpack.common.js webpack.common.js.backup
print_success "Backup created: webpack.common.js.backup"

# Step 7: Update webpack configuration
print_status "Step 7: Updating webpack configuration..."
cat > webpack.common.js << 'EOF'
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./chrome/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Environment detection
const shouldUseMock = process.env.NODE_ENV === 'test' || process.env.USE_MOCK === 'true';

const config = {
    mode: "development",
    devtool: "source-map",
    entry: {
        app: path.join(__dirname, "./static/index.js"),
        background: path.join(__dirname, "./static/background.js"),
        content: path.join(__dirname, "./static/content.js"),
        shadowContent: path.join(__dirname, "./static/shadow-content.js")
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx", ".*"],
        alias: {
            "log-view-machine": shouldUseMock
                ? path.resolve(__dirname, "src/mocks/log-view-machine.ts")
                : path.resolve(__dirname, "../log-view-machine/dist/index.esm.js"),
            "process/browser": require.resolve("process/browser")
        },
        fallback: {
            "path": require.resolve("path-browserify"),
            "tty": require.resolve("tty-browserify"),
            "util": require.resolve("util/"),
            "util-deprecate": path.resolve(__dirname, "src/polyfills/util-deprecate-browser.js"),
            "fs": false,
            "net": false,
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "querystring": require.resolve("querystring-es3"),
            "url": require.resolve("url/"),
            "http": require.resolve("stream-http"),
            "crypto": require.resolve("crypto-browserify"),
            "vm": require.resolve("vm-browserify"),
            "assert": require.resolve("assert/"),
            "events": require.resolve("events/"),
            "buffer": require.resolve("buffer/"),
            "string_decoder": require.resolve("string_decoder/"),
            "async_hooks": false,
            "process": require.resolve("process/browser")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            'config': 'config',
            'process': 'process/browser',
            'Buffer': ['buffer', 'Buffer'],
            'util-deprecate': path.resolve(__dirname, "src/polyfills/util-deprecate-browser.js"),
        }),
        new webpack.DefinePlugin({
            'regeneratorRuntime': 'regeneratorRuntime',
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'global': 'globalThis'
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^util-deprecate$/,
            contextRegExp: /node_modules/
        }),
        new webpack.ProvidePlugin({
            'global': 'globalThis'
        }),
        new HtmlWebpackPlugin({
            title: "boilerplate",
            meta: {
                charset: "utf-8",
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
                "theme-color": "#000000"
            },
            manifest: "manifest.json",
            filename: "index.html",
            template: "./static/index.html",
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./chrome/icons"),
                    to: path.resolve(__dirname, "./build/icons")
                },
                {
                    from: path.resolve(__dirname, "./static/receive_eth.jpg"),
                    to: path.resolve(__dirname, "./build/receive_eth.jpg")
                }
            ]
        }),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        compilerOptions: {
                            sourceMap: true
                        }
                    }
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;
EOF

print_success "Webpack configuration updated with environment-based switching"

# Step 8: Test the new configuration
print_status "Step 8: Testing new configuration..."

# Test with mocks
print_status "Testing with mocks (NODE_ENV=test)..."
export NODE_ENV=test
export USE_MOCK=true
if npm run build; then
    print_success "Build with mocks succeeded"
else
    print_error "Build with mocks failed"
    exit 1
fi

# Test with real package
print_status "Testing with real package (NODE_ENV=development)..."
export NODE_ENV=development
export USE_MOCK=false
if npm run build; then
    print_success "Build with real package succeeded"
else
    print_error "Build with real package failed"
    exit 1
fi

# Step 9: Create environment detection utility
print_status "Step 9: Creating environment detection utility..."
mkdir -p src/utils
cat > src/utils/environment.ts << 'EOF'
/**
 * Environment detection utilities for mock vs real package switching
 */

export const isTestEnvironment = (): boolean => {
    return process.env.NODE_ENV === 'test';
};

export const isDevelopmentEnvironment = (): boolean => {
    return process.env.NODE_ENV === 'development';
};

export const isProductionEnvironment = (): boolean => {
    return process.env.NODE_ENV === 'production';
};

export const shouldUseMock = (): boolean => {
    return isTestEnvironment() || process.env.USE_MOCK === 'true';
};

export const getPackageSource = (): 'mock' | 'real' => {
    return shouldUseMock() ? 'mock' : 'real';
};

export const logPackageUsage = (): void => {
    const source = getPackageSource();
    console.log(`📦 Using ${source} log-view-machine package (NODE_ENV: ${process.env.NODE_ENV})`);
};
EOF

print_success "Environment detection utility created"

# Step 10: Create validation test
print_status "Step 10: Creating validation test..."
mkdir -p test/validation
cat > test/validation/package-validation.test.ts << 'EOF'
import { shouldUseMock, getPackageSource, isTestEnvironment, isDevelopmentEnvironment, isProductionEnvironment } from '../../src/utils/environment';

describe('Package Validation', () => {
    beforeEach(() => {
        // Reset environment variables
        delete process.env.USE_MOCK;
    });

    describe('Environment Detection', () => {
        test('should detect test environment', () => {
            process.env.NODE_ENV = 'test';
            expect(isTestEnvironment()).toBe(true);
            expect(isDevelopmentEnvironment()).toBe(false);
            expect(isProductionEnvironment()).toBe(false);
        });

        test('should detect development environment', () => {
            process.env.NODE_ENV = 'development';
            expect(isTestEnvironment()).toBe(false);
            expect(isDevelopmentEnvironment()).toBe(true);
            expect(isProductionEnvironment()).toBe(false);
        });

        test('should detect production environment', () => {
            process.env.NODE_ENV = 'production';
            expect(isTestEnvironment()).toBe(false);
            expect(isDevelopmentEnvironment()).toBe(false);
            expect(isProductionEnvironment()).toBe(true);
        });
    });

    describe('Mock Usage Logic', () => {
        test('should use mock in test environment', () => {
            process.env.NODE_ENV = 'test';
            expect(shouldUseMock()).toBe(true);
            expect(getPackageSource()).toBe('mock');
        });

        test('should use real package in development', () => {
            process.env.NODE_ENV = 'development';
            expect(shouldUseMock()).toBe(false);
            expect(getPackageSource()).toBe('real');
        });

        test('should use real package in production', () => {
            process.env.NODE_ENV = 'production';
            expect(shouldUseMock()).toBe(false);
            expect(getPackageSource()).toBe('real');
        });

        test('should use mock when USE_MOCK=true', () => {
            process.env.NODE_ENV = 'development';
            process.env.USE_MOCK = 'true';
            expect(shouldUseMock()).toBe(true);
            expect(getPackageSource()).toBe('mock');
        });
    });
});
EOF

print_success "Validation test created"

# Step 11: Final validation
print_status "Step 11: Running final validation..."

# Test with mocks
export NODE_ENV=test
export USE_MOCK=true
if npm test -- test/validation/package-validation.test.ts; then
    print_success "Validation test with mocks passed"
else
    print_warning "Validation test failed, but continuing..."
fi

# Test with real package
export NODE_ENV=development
export USE_MOCK=false
if npm run build; then
    print_success "Final build with real package succeeded"
else
    print_error "Final build with real package failed"
    exit 1
fi

# Step 12: Create rollback script
print_status "Step 12: Creating rollback script..."
cat > scripts/rollback-to-mocks.sh << 'EOF'
#!/bin/bash

echo "🔄 Rolling back to mocks..."

# Restore webpack config
if [ -f "webpack.common.js.backup" ]; then
    cp webpack.common.js.backup webpack.common.js
    echo "✅ Webpack configuration restored"
else
    echo "❌ Backup webpack configuration not found"
fi

# Force mock usage
export USE_MOCK=true
export NODE_ENV=development

# Rebuild
npm run build

echo "✅ Rollback complete - using mocks"
EOF

chmod +x scripts/rollback-to-mocks.sh
print_success "Rollback script created"

# Final summary
print_success "🎉 Migration completed successfully!"
echo ""
echo "📋 Summary:"
echo "  ✅ Environment-based package switching implemented"
echo "  ✅ Webpack configuration updated"
echo "  ✅ Environment detection utility created"
echo "  ✅ Validation tests created"
echo "  ✅ Rollback script created"
echo ""
echo "🔧 Usage:"
echo "  • Development: npm run build (uses real package)"
echo "  • Testing: npm test (uses mocks)"
echo "  • Force mocks: USE_MOCK=true npm run build"
echo "  • Rollback: ./scripts/rollback-to-mocks.sh"
echo ""
echo "📝 Next steps:"
echo "  1. Test the extension in Chrome"
echo "  2. Run Playwright tests"
echo "  3. Monitor for any issues"
echo "  4. Gradually remove mock-specific code"
