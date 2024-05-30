const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false }); // Launch browser
    const context = await browser.newContext(); // Create a new browser context
    const page = await context.newPage(); // Open a new page
    await page.screenshot({ path: 'screen1.png' });

    // 1. Open https://www.saucedemo.com/ website
    await page.goto('https://www.saucedemo.com/');
    await page.screenshot({ path: 'screen2.png' });


    // 2. Login to webapp with userID : standard_user and password: secret_sauce
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.screenshot({ path: 'screen3.png' });
    await page.click('#login-button');
    await page.screenshot({ path: 'screen4.png' });


    // 3. Add items to cart
    const itemsToAdd = ["Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt"];
    for (const item of itemsToAdd) {
        await page.click(`[data-test="add-to-cart-${item.split(" ").join("-").toLowerCase()}"]`);
        await page.screenshot({ path: 'screen5.png' });

    }

    // 4. Make sure items are present in testData.csv
    const testData = require('./testData.csv');
    for (const item of itemsToAdd) {
        if (!testData.includes(item)) {
           console.log(`Item '${item}' is not present in testData.csv`);
    }
   }

    // 6. Go to cart
    await page.click('[data-test="shopping-cart-link"]');
	await page.screenshot({ path: 'screen6.png' });

    // 7. Remove “Sauce Labs Bike Light” from item list
    await page.click('[data-test="remove-sauce-labs-bike-light"]');
	await page.screenshot({ path: 'screen7.png' });

    // 8. Click “Checkout”
    await page.click('[data-test="checkout"]');
	await page.screenshot({ path: 'screen8.png' });

    // 9. Provide your First Name, Last Name, Zip Code
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
	await page.screenshot({ path: 'screen9.png' });

    // 10. Click “Continue”
    await page.click('[data-test="continue"]');
	await page.screenshot({ path: 'screen10.png' });

    // 11. Click “Sauce Labs Bolt T-Shirt” in checkout, remove the item
	 await page.waitForSelector('#item_1_title_link');
	await page.click('#item-1-title-link', { timeout: 60000 });
    await page.click('[data-test="remove"]');
	await page.screenshot({ path: 'screen11.png' });

    // 12. Click on the cart
    await page.click('[data-test="cart"]');
	await page.screenshot({ path: 'screen12.png' });

    // 13. Click “Checkout”
    await page.click('[data-test="checkout"]');
	await page.screenshot({ path: 'screen13.png' });

    // 14. Provide your First Name, Last Name, Zip Code
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
	await page.screenshot({ path: 'screen14.png' });

    // 15. On Checkout: Overview screen, check for the total price and click appropriate button
    const totalPrice = await page.textContent('[data-test="checkout_summary_container"] .summary_total_label');
    if (parseFloat(totalPrice.replace('$', '')) < 40.00) {
        await page.click('[data-test="finish"]');
    } else {
        await page.click('[data-test="cancel"]');
    }

    // 16. Verify the completion message
    const completionMessage = await page.textContent('[data-test="checkout_complete_container"]');
    if (completionMessage !== "Thank you for your order!") {
        throw new Error("Unexpected completion message: " + completionMessage);
    }

    // 17. Click “Back Home” to go to home page
    await page.click('[data-test="back-to-products"]');

    // 18. Click on 3 lines and then click Log Out
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');

    await browser.close();
})();
