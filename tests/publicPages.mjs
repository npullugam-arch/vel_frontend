import { build } from "esbuild";

// Render real components without a server or production API connection.
const result = await build({
  stdin: {
    contents: `
      import React from "react";
      import assert from "node:assert/strict";
      import { renderToStaticMarkup } from "react-dom/server";
      import { MemoryRouter } from "react-router-dom";
      import PublicPage from "./src/pages/PublicPage.jsx";
      import HomePage from "./src/pages/HomePage.jsx";
      import RegisterModal from "./src/components/RegisterModal.jsx";
      import { policies } from "./src/data/policies.js";
      import { readFileSync } from "node:fs";
      const app = readFileSync("src/App.jsx", "utf8");
      const home = renderToStaticMarkup(<MemoryRouter><HomePage /></MemoryRouter>);
      assert.ok(home.includes('id="home"'));
      assert.ok(!home.includes('Students Trained'));
      const routes = [...Object.keys(policies), "contact", "programs", "projects"];
      for (const page of routes) {
        const html = renderToStaticMarkup(<MemoryRouter><PublicPage page={page} /></MemoryRouter>);
        assert.match(html, /<h1>/);
        assert.match(html, /<footer/);
        assert.match(app, new RegExp('path="/' + page + '"'));
        for (const target of routes) assert.ok(html.includes('href="/' + target + '"'), page + ': ' + target);
        assert.ok(!html.includes('href="#'), 'Cross-page navigation must point to home sections');
      }
      const item = { title: "Test training", fee: 500, description: "Practical training", duration: "2 weeks", programStartInfo: "October 2026", deliverables: "Two sessions", eligibility: "Students", deliveryDetails: "Email within 2 business days" };
      const modal = (record) => renderToStaticMarkup(<RegisterModal open={true} item={record} type="INTERNSHIP" itemId={1} itemTitle={record.title} onClose={() => {}} />);
      const paid = modal(item);
      assert.ok(paid.includes('payment-qr-image'));
      assert.ok(paid.indexOf('Practical training') < paid.indexOf('payment-qr-image'));
      assert.ok(paid.indexOf('/refund-cancellation-policy') < paid.indexOf('payment-qr-image'));
      for (const record of [{ ...item, fee: 0 }, { ...item, fee: null }, { ...item, duration: null }]) {
        const html = modal(record);
        assert.ok(!html.includes('payment-qr-image'));
        assert.ok(!html.includes('Account Number:'));
        assert.ok(html.includes('Submit Registration'));
      }
      console.log('Passed: 8 public page renders, footer route links, and paid/free/incomplete registration displays.');
    `,
    resolveDir: process.cwd(), loader: "jsx",
  },
  bundle: true, platform: "node", format: "esm", jsx: "automatic", write: false,
  define: { "process.env.NODE_ENV": '"production"', "import.meta.env": "{}" },
});
// Bundling CommonJS dependencies requires a require function for Node builtins.
const { createRequire } = await import("node:module");
globalThis.require = createRequire(import.meta.url);
try {
  await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
