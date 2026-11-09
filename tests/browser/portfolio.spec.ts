import { expect, test, type Locator } from '@playwright/test';

const navTargets = ['introduce', 'about-b', 'works-b', 'principles-b', 'contact-b'] as const;

const mobileViewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 }
] as const;

async function effectiveOpacity(element: Locator) {
  return element.evaluate((node) => {
    let opacity = 1;
    for (let parent: Element | null = node; parent; parent = parent.parentElement) {
      opacity *= Number(getComputedStyle(parent).opacity);
    }
    return opacity;
  });
}

for (const viewport of mobileViewports) {
  test.describe(`${viewport.width}px static rendering`, () => {
    test.use({ viewport, javaScriptEnabled: false });

    test('core copy and all five anchor destinations survive without JavaScript', async ({
      page
    }) => {
      await page.goto('/');

      const copy = page.locator('.b-intro-copy');
      await expect(copy).toContainText('I lead financial');
      await expect(copy).toContainText('Mocha');
      await expect(copy).toBeVisible();

      for (const id of navTargets) {
        const link = page.locator(`nav a[href="#${id}"]:visible`).first();
        const destination = page.locator(`#${id}`);
        await expect(link).toBeVisible();
        await expect.poll(() => effectiveOpacity(link)).toBeGreaterThan(0.9);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect(destination).toBeInViewport();
      }
      await expect(copy).toHaveCSS('opacity', '1');
    });
  });

  test.describe(`${viewport.width}px mobile navigation`, () => {
    test.use({ viewport });

    test('all five menu links navigate and focus their destinations', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      const menu = page.locator('.b-menu-dialog');
      const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
      const unfocusedTargets: string[] = [];

      for (const id of navTargets) {
        await menuButton.click();
        await expect(menu).toHaveAttribute('open', '');
        await menu.locator(`a[href="#${id}"]`).click();
        await expect(menu).not.toHaveAttribute('open', '');
        await expect
          .poll(() => page.locator('html').evaluate((html) => html.style.overflow))
          .not.toBe('hidden');
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        const focusedId = await page.evaluate(() => document.activeElement?.id);
        if (focusedId !== id) unfocusedTargets.push(`${id} (focused: ${focusedId || 'no id'})`);
      }

      expect(unfocusedTargets, 'menu navigation should leave focus on each destination').toEqual(
        []
      );
    });

    test('Escape closes the menu and returns focus to its button', async ({ page }) => {
      await page.goto('/');

      const menu = page.locator('.b-menu-dialog');
      const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
      await menuButton.click();
      await expect(menu).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(menu).not.toHaveAttribute('open', '');
      await expect
        .poll(() => page.locator('html').evaluate((html) => html.style.overflow))
        .not.toBe('hidden');
      await expect(menuButton).toBeFocused();
    });
  });
}

test.describe('1440px static sidebar', () => {
  test.use({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });

  test('keeps all five sidebar links visibly available without JavaScript', async ({ page }) => {
    await page.goto('/');

    for (const id of navTargets) {
      const link = page.locator(`.b-sidebar-nav a[href="#${id}"]`);
      await expect(link).toBeVisible();
      await expect.poll(() => effectiveOpacity(link)).toBeGreaterThan(0.9);
    }

    await page.locator('.b-sidebar-nav a[href="#about-b"]').click();
    await expect(page).toHaveURL(/#about-b$/);
    await expect(page.locator('#about-b')).toBeInViewport();
  });
});

test.describe('375px project summary dialog', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Escape closes the Flot summary and returns focus to its trigger', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByRole('button', { name: 'Read about 01 / Flot' });
    const dialog = page.locator('.b-project-dialog');
    await trigger.click();
    await expect(dialog).toHaveAttribute('open', '');
    await expect(dialog.getByRole('heading', { name: 'Flot', exact: true })).toBeVisible();
    await expect
      .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
      .toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '');
    await expect
      .poll(() => page.locator('html').evaluate((html) => html.style.overflow))
      .not.toBe('hidden');
    await expect(trigger).toBeFocused();
  });
});

test('intro copy remains visible while critical fonts are delayed', async ({ page }) => {
  let unblockFonts!: () => void;
  const fontGate = new Promise<void>((resolve) => {
    unblockFonts = resolve;
  });
  let interceptedFonts = 0;

  await page.route(/\.(?:woff2?|ttf|otf)(?:\?.*)?$/i, async (route) => {
    interceptedFonts += 1;
    await fontGate;
    await route.continue();
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => interceptedFonts).toBeGreaterThan(0);
    await page.waitForTimeout(300);
    const copy = page.locator('.b-intro-copy');
    await expect(copy).toBeVisible({ timeout: 1_000 });
    await expect(copy).toHaveCSS('opacity', '1', { timeout: 1_000 });
  } finally {
    unblockFonts();
  }
});

test('ordinary desktop visits retain the animated scroll introduction', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const root = page.locator('.variant-b');
  const scene = page.locator('.b-intro-scene');
  await expect(root).toHaveClass(/b-ready/);
  await expect(root).not.toHaveClass(/b-static|b-flow/);
  await expect(page.locator('.b-intro-stage')).toHaveCSS('position', 'sticky');
  expect(await scene.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(
    1800
  );

  await page.evaluate(() => window.scrollTo({ top: innerHeight * 1.2, behavior: 'instant' }));
  await expect
    .poll(() =>
      page.locator('.b-intro-copy').evaluate((element) => Number(getComputedStyle(element).opacity))
    )
    .toBeGreaterThan(0.5);
});

for (const viewport of [...mobileViewports, { width: 1440, height: 900 }]) {
  test.describe(`${viewport.width}px reduced motion`, () => {
    test.use({ viewport, reducedMotion: 'reduce' });

    test('keeps introduction copy in static document flow', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.variant-b')).toHaveClass(/b-static/);
      await expect(page.locator('.b-intro-copy')).toHaveCSS('opacity', '1');
      await expect(page.locator('.b-intro-stage')).toHaveCSS('position', 'relative');
    });
  });
}

test('opacity-hidden links stay out of the initial keyboard Tab order', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.variant-b')).toHaveClass(/b-ready/);

  const hiddenFocusedLinks: string[] = [];
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement) || !element.matches('a, button')) return null;

      let opacity = 1;
      for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
        opacity *= Number(getComputedStyle(parent).opacity);
      }
      return {
        label: element.textContent?.trim() || element.getAttribute('aria-label') || '',
        opacity
      };
    });
    if (focused && focused.opacity < 0.05) hiddenFocusedLinks.push(focused.label);
  }

  expect(
    hiddenFocusedLinks,
    'focus reached a link or button inside an opacity-hidden layer'
  ).toEqual([]);
});
