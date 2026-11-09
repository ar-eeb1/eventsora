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
  })
    .select('name description media')
    .populate('media', 'secure_url')
    .lean()
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const pageUrl = `https://www.eventsora.com/shop/${category}/${slug}`
  const fallbackImage = 'https://res.cloudinary.com/dliahmplq/image/upload/v1776787244/Untitled_design_1_qfvqha.png'
  const fallback = {
    title: 'Product not found | Eventsora Shop',
    openGraph: {
      title: 'Eventsora Shop',
      url: pageUrl,
      siteName: 'Eventsora',
      type: 'website',
      images: [{ url: fallbackImage, width: 1200, height: 630, alt: 'Eventsora' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [fallbackImage],
    },
  }

  try {
    const product = await getProduct(category, slug)
    if (!product) return fallback

    const description = product.description
      ?.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160) || `Shop ${product.name} on Eventsora.`
    const firstImage = product.media?.[0]?.secure_url
    const imageUrl = firstImage?.includes('/upload/')
      ? firstImage.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_jpg/')
      : firstImage || fallbackImage
    const socialImage = { url: imageUrl, width: 1200, height: 630, alt: product.name }

    return {
      title: `${product.name} | Eventsora Shop`,
      description,
      openGraph: {
        title: product.name,
        description,
        url: pageUrl,
        siteName: 'Eventsora',
        type: 'website',
        images: [socialImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description,
        images: [imageUrl],
      },
    }
  } catch (error) {
    console.error('Product metadata error:', error)
    return fallback
  }
}

const page = async ({ params, searchParams }) => {
  const { category, slug } = await params
  const query = await searchParams
  return (
    <ShopProductLoader
      categorySlug={category}
      productSlug={slug}
      selectedVariantId={typeof query?.variant === 'string' ? query.variant : ''}
    />
  )
}

export default page