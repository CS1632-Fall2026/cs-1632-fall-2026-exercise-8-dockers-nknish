import { test, expect } from '@playwright/test';
/*
TEST FIXTURE:
1. Firefox browser version >= 105, or Chrome browser version >= 105 is installed and launched.
2. The URL http://localhost:8080/ is open on the web browser.
3. The values of cookies "1", "2", and "3" are set to "false" (no cats are rented).
*/
test.beforeEach(async ({ page }) => {
    // TODO: BROWSER VERSIONS

    // load page
    await page.goto('http://localhost:8080/');

    // set cookie values
    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    })

});


test("TEST-1-RESET", async ({ page }) => {
    // pre
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    })

    
    // exec
    await page.getByRole('link').filter({hasText: "Reset"}).click();
    
    // post
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(0)).toHaveText("ID 1. Jennyanydots");
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(1)).toHaveText("ID 2. Old Deuteronomy");
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(2)).toHaveText("ID 3. Mistoffelees");
})


test("TEST-2-CATALOG", async ({ page }) => {    
    // exec
    await page.getByRole('link').filter({hasText: "Catalog"}).click();
    
    // post
    const src = await page.getByLabel("Cat photos").getByRole("listitem").nth(1).locator("img").getAttribute("src");
    expect(src).toBe("/images/cat2.jpg")
})


test("TEST-3-LISTING", async ({ page }) => {    
    // exec
    await page.getByRole('link').filter({hasText: "Catalog"}).click();
    
    // post
    await expect(page.getByLabel("Cat names").getByRole("listitem")).toHaveCount(3);
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(2)).toHaveText("ID 3. Mistoffelees");
})


test("TEST-4-RENT-A-CAT", async({ page}) => {
    // exec
    await page.getByRole('link').filter({hasText: "Rent-A-Cat"}).click();

    // post
    await expect(page.getByRole("button").filter({hasText: "Rent"})).toBeVisible()
    await expect(page.getByRole("button").filter({hasText: "Return"})).toBeVisible()
})


test("TEST-5-RENT", async({ page}) => {
    // exec
    await page.getByRole('link').filter({hasText: "Rent-A-Cat"}).click();
    await page.getByLabel("Enter the ID of the cat to rent:").fill("1");
    await page.getByRole('button').filter({hasText: "Rent"}).click();

    // post
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(0)).toHaveText("Rented out");
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(1)).toHaveText("ID 2. Old Deuteronomy");
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(2)).toHaveText("ID 3. Mistoffelees");
    await expect(page.getByText("Success!")).toBeVisible()
})


test("TEST-6-RETURN", async({ page}) => {
    // pre
    await page.evaluate(() => {
        document.cookie = "2=true";
        document.cookie = "3=true";
    })

    // exec
    await page.getByRole('link').filter({hasText: "Rent-A-Cat"}).click();
    await page.getByLabel("Enter the ID of the cat to return:").fill("2");
    await page.getByRole('button').filter({hasText: "Return"}).click();

    // post
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(0)).toHaveText("ID 1. Jennyanydots");
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(1)).toHaveText("ID 2. Old Deuteronomy");
    await expect(page.getByLabel("Cat names").getByRole("listitem").nth(2)).toHaveText("Rented out");
    await expect(page.getByText("Success!")).toBeVisible()
})


test("TEST-7-FEED-A-CAT", async({ page}) => {
    // exec
    await page.getByRole('link').filter({hasText: "Feed-A-Cat"}).click();

    // post
    await expect(page.getByRole("button").getByText("Feed")).toBeVisible()
})


test("TEST-8-FEED", async({ page}) => {
    // exec
    await page.getByRole('link').filter({hasText: "Feed-A-Cat"}).click();
    await page.getByLabel("Number of catnips to feed:").fill("6");
    await page.getByRole('button').filter({hasText: "Feed"}).click();

    // post
    await expect(page.getByText("Nom, nom, nom.")).toBeVisible({timeout: 10_000})
})


test("TEST-9-GREET-A-CAT", async({ page}) => {
    // exec
    await page.getByRole('link').filter({hasText: "Greet-A-Cat"}).click();

    // post
    await expect(page.getByText("Meow!Meow!Meow!")).toBeVisible()
})


test("TEST-10-GREET-A-CAT-WITH-NAME", async({ page}) => {
    // exec
    await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');

    // post
    await expect(page.getByText("Meow! from Jennyanydots.")).toBeVisible()
})


test("TEST-11-FEED-A-CAT-SCREENSHOT", async({ page}) => {
    // pre
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    })

    // exec
    await page.getByRole('link').filter({hasText: "Feed-A-Cat"}).click();

    // post
    await expect(page.locator("body")).toHaveScreenshot();
})
