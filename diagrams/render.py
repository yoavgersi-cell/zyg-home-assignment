import os
from playwright.sync_api import sync_playwright

here = os.path.dirname(os.path.abspath(__file__))
url = "file://" + os.path.join(here, "funnel.html")
out = os.path.join(here, "funnel.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(device_scale_factor=2, viewport={"width": 2400, "height": 700})
    page = ctx.new_page()
    page.goto(url)
    page.wait_for_timeout(300)
    el = page.query_selector(".wrap")
    el.screenshot(path=out)
    browser.close()
print("WROTE", out)
