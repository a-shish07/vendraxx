import test from 'node:test'
import assert from 'node:assert/strict'
import { productInput } from '../src/lib/product-input'

test('product input accepts only editable catalogue fields', () => {
  const result = productInput({ name: ' Cotton Shirt ', category: 'Clothing', price: 899, stock: 4, role: 'ADMIN', _id: 'forged', userId: 'forged' })
  assert.equal(result.name, 'Cotton Shirt')
  assert.equal(result.category, 'Clothing')
  assert.equal(result.price, 899)
  assert.equal(result.stock, 4)
  assert.equal('role' in result, false)
  assert.equal('_id' in result, false)
  assert.equal('userId' in result, false)
})

test('product input rejects negative prices and fractional or negative inventory', () => {
  assert.throws(() => productInput({ name: 'Shirt', category: 'Clothing', price: -1, stock: 2 }))
  assert.throws(() => productInput({ name: 'Shirt', category: 'Clothing', price: 10, stock: -1 }))
  assert.throws(() => productInput({ name: 'Shirt', category: 'Clothing', price: 10, stock: 1.5 }))
})

test('product input only accepts HTTPS image URLs and product owned public IDs', () => {
  assert.throws(() => productInput({ name: 'Shirt', category: 'Clothing', price: 10, image: 'javascript:alert(1)' }))
  assert.throws(() => productInput({ name: 'Shirt', category: 'Clothing', price: 10, imagePublicIds: ['other-account/private'] }))
  const result = productInput({ name: 'Shirt', category: 'Clothing', price: 10, image: 'https://res.cloudinary.com/demo/image/upload/shirt.jpg', imagePublicIds: ['vendrax/products/shirt'] })
  assert.equal(result.image, 'https://res.cloudinary.com/demo/image/upload/shirt.jpg')
})
