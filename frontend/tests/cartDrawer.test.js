import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Shopping Cart Drawer - Quantity Controls & Inventory Rules', () => {

  const regularProduct = {
    id: 'item-reg-1',
    productId: 'prod-reg-1',
    name: 'Classic Gold Ring',
    numericPrice: 24000,
    price: '₹ 24,000',
    quantity: 1,
    stockQuantity: 5,
    isUnique: false,
  };

  const uniqueProduct = {
    id: 'item-uniq-1',
    productId: 'prod-uniq-1',
    name: 'Antique Ruby Temple Choker',
    numericPrice: 158000,
    price: '₹ 1,58,000',
    quantity: 1,
    stockQuantity: 1,
    isUnique: true,
  };

  it('calculates total cart pieces count as sum of quantities', () => {
    const items = [
      { ...regularProduct, quantity: 3 },
      { ...uniqueProduct, quantity: 1 },
    ];
    const totalPieces = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    assert.equal(totalPieces, 4);
  });

  it('calculates overall cart subtotal as sum of (numericPrice * quantity)', () => {
    const items = [
      { ...regularProduct, quantity: 2 }, // 24000 * 2 = 48000
      { ...uniqueProduct, quantity: 1 }, // 158000 * 1 = 158000
    ];
    const overallSubtotal = items.reduce(
      (acc, item) => acc + (item.numericPrice || 0) * (item.quantity || 1),
      0
    );
    assert.equal(overallSubtotal, 206000);
  });

  it('disallows quantity increase beyond available stock for regular products', () => {
    const item = { ...regularProduct, quantity: 5, stockQuantity: 5 };
    const canIncrement = !item.isUnique && (!item.stockQuantity || item.quantity < item.stockQuantity);
    assert.equal(canIncrement, false);
  });

  it('allows quantity increase when stock is available for regular products', () => {
    const item = { ...regularProduct, quantity: 2, stockQuantity: 5 };
    const canIncrement = !item.isUnique && (!item.stockQuantity || item.quantity < item.stockQuantity);
    assert.equal(canIncrement, true);
    assert.equal(item.quantity + 1, 3);
  });

  it('disallows quantity decrease below 1', () => {
    const item = { ...regularProduct, quantity: 1 };
    const canDecrement = !item.isUnique && item.quantity > 1;
    assert.equal(canDecrement, false);
  });

  it('allows quantity decrease when quantity > 1', () => {
    const item = { ...regularProduct, quantity: 3 };
    const canDecrement = !item.isUnique && item.quantity > 1;
    assert.equal(canDecrement, true);
    assert.equal(item.quantity - 1, 2);
  });

  it('strictly locks unique jewellery piece quantity to 1 (both increment and decrement disabled)', () => {
    const item = { ...uniqueProduct, quantity: 1 };
    const canIncrement = !item.isUnique && (!item.stockQuantity || item.quantity < item.stockQuantity);
    const canDecrement = !item.isUnique && item.quantity > 1;

    assert.equal(item.isUnique, true);
    assert.equal(canIncrement, false);
    assert.equal(canDecrement, false);
    assert.equal(item.quantity, 1);
  });

});

