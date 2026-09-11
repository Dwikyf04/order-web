import test from "node:test";
import assert from "node:assert/strict";
import { validateOrderInput } from "../src/domain/orders/orderSchema.js";

const validOrder = {
  school: {
    name: "SMA Negeri 1",
    address: "Jl. Pendidikan 1",
    city: "Jakarta",
    district: "Menteng",
    phone: "08123456789",
    budget: "10m-50m",
  },
  items: [{ productId: "product-id", quantity: 2 }],
};

test("accepts a complete order", () => {
  const result = validateOrderInput(validOrder);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test("rejects an order without items", () => {
  const result = validateOrderInput({ ...validOrder, items: [] });
  assert.equal(result.valid, false);
  assert.equal(result.errors.items, "Minimal satu produk harus dipilih.");
});

test("rejects invalid quantities", () => {
  const result = validateOrderInput({
    ...validOrder,
    items: [{ productId: "product-id", quantity: 0 }],
  });
  assert.equal(result.valid, false);
  assert.equal(result.errors["items.0.quantity"], "Jumlah produk harus minimal 1.");
});
