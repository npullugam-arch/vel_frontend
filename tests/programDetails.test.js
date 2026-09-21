import test from "node:test";
import assert from "node:assert/strict";
import { canShowPayment, formatProgramFee, hasFee, missingProgramDetails } from "../src/data/programDetails.js";

const program = {
  title: "Web development training", description: "Build and review a web application.",
  fee: "1250.50", duration: "4 weeks", programStartInfo: "Next cohort: October 2026",
  deliverables: "Four sessions and a reviewed project", eligibility: "Basic JavaScript",
  deliveryDetails: "Email invitation within 2 business days of verified payment; online sessions.",
};

test("complete paid programs can display payment instructions and retain paise", () => {
  assert.equal(canShowPayment(program), true);
  assert.match(formatProgramFee(program), /1,250\.50/);
});

test("free, missing, invalid and negative fees never display payment instructions", () => {
  for (const fee of [0, "0", "0.00", null, undefined, "", "  ", -1, "invalid", Infinity]) {
    assert.equal(canShowPayment({ ...program, fee }), false, `fee: ${fee}`);
  }
  assert.equal(hasFee({ fee: 0 }), true);
  assert.match(formatProgramFee({ fee: 0 }), /Free/);
  assert.match(formatProgramFee({}), /not published/);
});

test("every essential disclosure is needed before payment is displayed", () => {
  for (const key of Object.keys(program)) {
    assert.equal(canShowPayment({ ...program, [key]: " " }), false, key);
  }
  assert.equal(canShowPayment(null), false);
  assert.equal(canShowPayment(undefined), false);
});

test("registration dates cannot substitute for the program start information", () => {
  const oldRecord = { ...program, programStartInfo: null, startDate: "2026-09-01", endDate: "2026-09-30" };
  assert.equal(canShowPayment(oldRecord), false);
  assert.ok(missingProgramDetails(oldRecord).includes("start information"));
});
