import { test, expect } from '@playwright/test';

test.describe('Login and Transaction Flow', () => {
  test('user can login and send a transaction', async ({ page }) => {
    // Start from login page
    await page.goto('/');
    await expect(page).toHaveTitle(/ERC-4337 Smart Account Demo/);

    // Click on Google login (assuming it's the first option)
    const loginButtons = await page.$$('button');
    await loginButtons[0].click();

    // Wait for dashboard to load
    await expect(page).toHaveURL('/dashboard');
    await expect(page).toHaveText('Smart Account Dashboard');

    // Fill transaction details
    await page.fill('input[label="Recipient Address"]', '0xrecipientAddress');
    await page.fill('input[label="Amount (ZETA)"]', '1');

    // Click send transaction
    await page.click('button:text("Send Transaction")');

    // Wait for transaction to be processed
    await expect(page).toHaveText('Transaction pending');

    // Verify transaction appears in history
    await expect(page).toHaveText('Transaction 0xtransactionHash...');

    // Logout
    await page.click('button:text("Logout")');

    // Verify back to login page
    await expect(page).toHaveURL('/');
  });

  test('error handling during transaction', async ({ page }) => {
    // Start from login page
    await page.goto('/');
    await page.click('button'); // Click any login button

    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');

    // Try to send transaction without filling required fields
    await page.click('button:text("Send Transaction")');

    // Verify error message
    await expect(page).toHaveText('Please fill in recipient and amount');
  });
});
