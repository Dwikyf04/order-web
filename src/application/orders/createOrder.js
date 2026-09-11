import { validateOrderInput } from "../../domain/orders/orderSchema";
import { createOrder as persistOrder } from "../../infrastructure/orders/orderRepository";

export async function createOrder(input) {
  const validation = validateOrderInput(input);
  if (!validation.valid) {
    const error = new Error("Data pesanan tidak valid.");
    error.code = "VALIDATION_ERROR";
    error.details = validation.errors;
    throw error;
  }

  return persistOrder(input);
}
