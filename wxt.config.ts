import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'Wave Reader',
    short_name: '🌊r.',
    version: '1.0.0',
    description: 'Smoothly wobble text blocks, to improve eye tracking for reading!',
    icons: {
      16: 'icons/waver16.jpg',
      48: 'icons/waver48.png',
      128: 'icons/waver128.jpg'
    },
    action: {
      default_title: 'Wave Reader',
      default_popup: 'index.html',
      default_icon: 'icons/waver16.jpg'
    },
    background: {
      service_worker: 'background.js'
    },
    host_permissions: [
      '<all_urls>',
      'tabs',
      'activeTab'
    ],
    permissions: [
      'scripting',
      'declarativeContent',
      'storage',
      'notifications',
      'webNavigation',
      'activeTab',
      'tabs'
    ]
  },
  zip: {
    name: 'wave-reader'
  }
}) 