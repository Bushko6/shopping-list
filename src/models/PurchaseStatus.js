export const PurchaseStatus = Object.freeze({
  PENDING: 'pending',
  PURCHASED: 'purchased',
});

export function isPurchaseStatus(value) {
  return Object.values(PurchaseStatus).includes(value);
}
