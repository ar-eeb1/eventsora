import { connectDB } from '@/lib/databaseConnection'
import ProductModel from '@/models/Product.Model'
import ShopCategoryModel from '@/models/ShopCategory.model'
import ShopProductLoader from './ShopProductLoader'

const getProduct = async (categorySlug, productSlug) => {
  await connectDB()
  const category = await ShopCategoryModel.findOne({ slug: categorySlug, deletedAt: null }).select('_id').lean()
  if (!category) return null
  return ProductModel.findOne({
    slug: productSlug,
    category: category._id,
    status: 'approved',
    deletedAt: null,
  }).select('name description').lean()
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const product = await getProduct(category, slug)
  if (!product) return { title: 'Product not found | Eventsora Shop' }

  return {
    title: `${product.name} | Eventsora Shop`,
    description: product.description?.replace(/\s+/g, ' ').slice(0, 160) || `Shop ${product.name} on Eventsora.`,
  }
}

const page = async ({ params }) => {
  const { category, slug } = await params
  return <ShopProductLoader categorySlug={category} productSlug={slug} />
}

export default page