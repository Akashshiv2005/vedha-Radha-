import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { adaptStorefrontProduct } from '../src/api/storefrontProductsClient.js';

describe('Storefront Product Adapter & 3-Image Gallery Sync', () => {
  it('strictly caps images array to a maximum of 3 items', () => {
    const raw = {
      id: 'prod-123',
      sku: 'SKU-FOUR-IMG',
      name: 'Diamond Gold Bangle',
      price: 54000,
      images: [
        'http://minio/products/img1.webp',
        'http://minio/products/img2.webp',
        'http://minio/products/img3.webp',
        'http://minio/products/img4.webp',
        'http://minio/products/img5.webp'
      ]
    };

    const adapted = adaptStorefrontProduct(raw);
    assert.equal(adapted.images.length, 3);
    assert.deepEqual(adapted.images, [
      'http://minio/products/img1.webp',
      'http://minio/products/img2.webp',
      'http://minio/products/img3.webp'
    ]);
  });

  it('sets the first image as the primary cover image', () => {
    const raw = {
      sku: 'SKU-PRIMARY',
      name: 'Temple Choker',
      price: 125000,
      images: [
        'http://minio/products/cover.webp',
        'http://minio/products/angle.webp'
      ]
    };

    const adapted = adaptStorefrontProduct(raw);
    assert.equal(adapted.image, 'http://minio/products/cover.webp');
    assert.equal(adapted.images[0], 'http://minio/products/cover.webp');
  });

  it('handles products with single image without adding empty placeholders', () => {
    const raw = {
      sku: 'SKU-SINGLE',
      name: 'Simple Studs',
      price: 8500,
      images: ['http://minio/products/single.webp']
    };

    const adapted = adaptStorefrontProduct(raw);
    assert.equal(adapted.images.length, 1);
    assert.equal(adapted.image, 'http://minio/products/single.webp');
    assert.equal(adapted.images[0], 'http://minio/products/single.webp');
  });

  it('falls back safely to neutral placeholder when no images are provided', () => {
    const raw = {
      sku: 'SKU-NO-IMG',
      name: 'Unset Stone Ring',
      price: 19000,
      images: [],
      image: null
    };

    const adapted = adaptStorefrontProduct(raw);
    assert.equal(adapted.images.length, 1);
    assert.equal(adapted.image, '/images/neutral_product_placeholder.svg');
    assert.equal(adapted.images[0], '/images/neutral_product_placeholder.svg');
  });

  it('preserves ordered image sequence accurately', () => {
    const raw = {
      sku: 'SKU-ORDER',
      name: 'Navratna Necklace',
      price: 98000,
      images: [
        'http://minio/products/front.webp',
        'http://minio/products/side.webp',
        'http://minio/products/hallmark.webp'
      ]
    };

    const adapted = adaptStorefrontProduct(raw);
    assert.equal(adapted.images[0], 'http://minio/products/front.webp');
    assert.equal(adapted.images[1], 'http://minio/products/side.webp');
    assert.equal(adapted.images[2], 'http://minio/products/hallmark.webp');
  });
});
