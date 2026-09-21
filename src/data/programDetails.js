export function hasFee(item) {
  return item?.fee !== null && item?.fee !== undefined && String(item.fee).trim() !== "" && Number.isFinite(Number(item.fee)) && Number(item.fee) >= 0;
}
export function formatProgramFee(item) {
  if (!hasFee(item)) return "Fee not published - do not pay yet";
  return Number(item.fee) === 0 ? "Free - no payment required" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(Number(item.fee));
}
export function missingProgramDetails(item = {}) {
  return [
    ["title", item.title], ["description", item.description || item.aboutText],
    ["fee", hasFee(item)], ["duration", item.duration],
    ["start information", item.programStartInfo], ["what you receive", item.deliverables],
    ["eligibility", item.eligibility], ["delivery and access timeline", item.deliveryDetails],
  ].filter(([, value]) => !value || (typeof value === "string" && !value.trim())).map(([label]) => label);
}
export function canShowPayment(item) {
  return !!item && Number(item.fee) > 0 && missingProgramDetails(item).length === 0;
}
