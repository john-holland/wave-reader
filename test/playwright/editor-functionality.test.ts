import { test, expect, Page } from '@playwright/test';

test.describe('Wave Reader Editor Functionality', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Navigate to the editor
    await page.goto('http://localhost:3003/wave-reader');
    await page.waitForLoadState('networkidle');
  });

  test('should load editor without JavaScript errors', async () => {
    // Check for any console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for the page to fully load
    await page.waitForTimeout(2000);

    // Verify no critical errors occurred
    expect(consoleErrors.filter(error => 
      error.includes('Cannot read properties of null') || 
      error.includes('classList')
    )).toHaveLength(0);

    // Verify the editor loaded successfully
    await expect(page.locator('h1')).toContainText('🎨 Wave Reader Editor');
    await expect(page.locator('.component-list')).toBeVisible();
  });

  test('should open component editor without classList errors', async () => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Click on the first component's "Open Editor" button
    const firstComponent = page.locator('.component-card').first();
    const openEditorBtn = firstComponent.locator('[data-action="open-editor"]');
    
    await openEditorBtn.click();
    
    // Wait for the editor to open
    await page.waitForTimeout(1000);
    
    // Verify the editor is visible
    await expect(page.locator('#componentEditor')).toBeVisible();
    await expect(page.locator('#componentEditor')).toHaveClass(/active/);
    
    // Check for any classList-related errors
    const classListErrors = consoleErrors.filter(error => 
      error.includes('Cannot read properties of null') || 
      error.includes('classList')
    );
    
    expect(classListErrors).toHaveLength(0);
    
    // Verify the code editor has content
    await expect(page.locator('#codeEditor')).toBeVisible();
  });

  test('should handle View Files button click correctly', async () => {
    // Set up dialog handler for the alert
    let alertMessage = '';
    page.on('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    // Click on the first component's "View Files" button
    const firstComponent = page.locator('.component-card').first();
    const viewFilesBtn = firstComponent.locator('[data-action="view-files"]');
    
    await viewFilesBtn.click();
    
    // Wait for the alert to appear
    await page.waitForTimeout(500);
    
    // Verify the alert message contains expected content
    expect(alertMessage).toContain('📁 Files for');
    expect(alertMessage).toContain('Click "Open Editor" to view and edit these files');
    
    // Verify the alert was accepted (no errors)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle file tree navigation without errors', async () => {
    // First open a component
    const firstComponent = page.locator('.component-card').first();
    const openEditorBtn = firstComponent.locator('[data-action="open-editor"]');
    await openEditorBtn.click();
    
    // Wait for editor to open and be visible
    await expect(page.locator('#componentEditor')).toBeVisible();
    await expect(page.locator('#componentEditor')).toHaveClass(/active/);
    
    // Listen for console errors during file navigation
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for file tree to be populated
    await expect(page.locator('.file-item')).toHaveCount(4);
    
    // Click on different file items in the file tree
    const fileItems = page.locator('.file-item');
    
    // Click on the second file item (index.html)
    const secondFileItem = fileItems.nth(1);
    await secondFileItem.click();
    await page.waitForTimeout(500);
    
    // Verify the second file item becomes active
    await expect(secondFileItem).toHaveClass(/active/);
    
    // Click on the third file item (types.html)
    const thirdFileItem = fileItems.nth(2);
    await thirdFileItem.click();
    await page.waitForTimeout(500);
    
    // Verify the third file item becomes active
    await expect(thirdFileItem).toHaveClass(/active/);
    
    // Check for any errors during file navigation
    const navigationErrors = consoleErrors.filter(error => 
      error.includes('Cannot read properties of null') || 
      error.includes('classList')
    );
    
    expect(navigationErrors).toHaveLength(0);
  });

  test('should handle component switching without errors', async () => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Open first component
    const firstComponent = page.locator('.component-card').first();
    const openEditorBtn = firstComponent.locator('[data-action="open-editor"]');
    await openEditorBtn.click();
    await page.waitForTimeout(1000);
    
    // Close editor
    const closeBtn = page.locator('#closeEditorBtn');
    await closeBtn.click();
    await page.waitForTimeout(500);
    
    // Open second component
    const secondComponent = page.locator('.component-card').nth(1);
    const secondOpenEditorBtn = secondComponent.locator('[data-action="open-editor"]');
    await secondOpenEditorBtn.click();
    await page.waitForTimeout(1000);
    
    // Verify no errors occurred during switching
    const switchingErrors = consoleErrors.filter(error => 
      error.includes('Cannot read properties of null') || 
      error.includes('classList')
    );
    
    expect(switchingErrors).toHaveLength(0);
    
    // Verify the second component editor is open
    await expect(page.locator('#componentEditor')).toBeVisible();
    await expect(page.locator('#componentEditor')).toHaveClass(/active/);
  });

  test('should display all component cards correctly', async () => {
    // Verify all expected components are present by looking for their headings
    const expectedComponents = [
      'Error Boundary',
      'Go Button', 
      'Selector Hierarchy',
      'Settings',
      'Wave Tabs',
      'Scan for Input',
      'Selector Input',
      'Wave Reader'
    ];
    
    for (const componentName of expectedComponents) {
      // Look specifically for the h4 heading with the component name
      await expect(page.locator(`h4:has-text("${componentName}")`)).toBeVisible();
    }
    
    // Verify each component has the required buttons
    const componentCards = page.locator('.component-card');
    const cardCount = await componentCards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = componentCards.nth(i);
      await expect(card.locator('[data-action="open-editor"]')).toBeVisible();
      await expect(card.locator('[data-action="view-files"]')).toBeVisible();
    }
  });

  test('should handle edge cases gracefully', async () => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Try to open a component that doesn't exist (should not cause errors)
    await page.evaluate(() => {
      // Simulate calling openComponent with invalid ID
      if (typeof openComponent === 'function') {
        openComponent('non-existent-component');
      }
    });
    
    await page.waitForTimeout(500);
    
    // Verify no critical errors occurred
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Cannot read properties of null') || 
      error.includes('classList') ||
      error.includes('TypeError')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
