import 'dotenv/config'
import { connectDB } from '../src/lib/mongodb'
import Product from '../src/models/Product'

await connectDB()
const products = [
  { name:'Basic Cotton T-Shirt', slug:'basic-cotton-t-shirt', price:499, image:'/placeholder-product.svg', category:'Clothing', description:'A comfortable everyday cotton t-shirt.', stock:50, featured:true },
  { name:'Everyday Fashion Accessory', slug:'everyday-fashion-accessory', price:299, image:'/placeholder-product.svg', category:'Fashion', description:'A simple accessory for everyday styling.', stock:50, featured:true },
  { name:'Henna Stencil Set', slug:'henna-stencil-set', price:249, image:'/placeholder-product.svg', category:'Henna Stencils', description:'Reusable stencil designs for creative henna looks.', stock:50, featured:true },
  { name:'Bridal Accessory Set', slug:'bridal-accessory-set', price:799, image:'/placeholder-product.svg', category:'Bridal Accessories', description:'A curated accessory set for bridal occasions.', stock:25, featured:true },
  { name:'Press-On Nail Set', slug:'press-on-nail-set', price:399, image:'/placeholder-product.svg', category:'Nails', description:'Ready-to-wear nail set with multiple styles.', stock:40, featured:true },
]
for(const p of products) await Product.findOneAndUpdate({slug:p.slug},p,{upsert:true,new:true})
console.log('Sample products seeded. Replace/add products from the admin panel.')
process.exit(0)
