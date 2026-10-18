import Link from 'next/link'
import { ArrowRight, Minus } from 'lucide-react'
import { Playfair_Display } from 'next/font/google'
import { connectDB } from '@/lib/databaseConnection'
import ProductModel from '@/models/Product.Model'
import ShopCategoryModel from '@/models/ShopCategory.model'
import ShopSubcategoryModel from '@/models/ShopSubcategory.model'
import '@/models/Media.model'
import { SHOP, SHOP_CATEGORY } from '@/routes/WebsiteRoute'
import HorizontalScrollContainer from '@/components/application/Website/HorizontalScrollContainer'
import ProductBox from '@/components/application/Shop/ProductBox'

export const revalidate = 0

const playfair = Playfair_Display({
  weight: ['400', '700'],
  display: 'swap',
  subsets: ['latin'],
})

const getCategoryIcon = (category) => {
  const categoryName = `${category.slug} ${category.category}`.toLowerCase()

  if (/cake|bakery/.test(categoryName)) return 'https://cdn.lordicon.com/kixubvkn.json'
  if (/flower|floral/.test(categoryName)) return 'https://cdn.lordicon.com/kezeezyg.json'
  return 'https://cdn.lordicon.com/kezeezyg.json'
}

const page = async ({ searchParams }) => {
  await connectDB()

  const params = await searchParams
  const categorySlug = typeof params?.category === 'string' ? params.category : ''
  const subcategorySlug = typeof params?.subcategory === 'string' ? params.subcategory : ''

  const [categories, subcategories] = await Promise.all([
    ShopCategoryModel.find({ deletedAt: null }).sort({ category: 1 }).lean(),
    ShopSubcategoryModel.find({ deletedAt: null }).sort({ shopSubCategory: 1 }).lean(),
  ])

  const selectedCategory = categories.find((category) => category.slug === categorySlug)
  const selectedSubcategory = subcategories.find((subcategory) => (
    subcategory.slug === subcategorySlug &&
    (!selectedCategory || String(subcategory.shopCategory) === String(selectedCategory._id))
  ))
  const productFilter = { status: 'approved', deletedAt: null }
  let invalidFilter = false

  if (categorySlug) {
    if (selectedCategory) productFilter.category = selectedCategory._id
    else invalidFilter = true
  }

  if (subcategorySlug) {
    if (selectedSubcategory) productFilter.subcategory = selectedSubcategory._id
    else invalidFilter = true
  }

  const products = invalidFilter ? [] : await ProductModel.find(productFilter)
    .populate('media', '_id secure_url thumbnail_url alt')
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(categorySlug || subcategorySlug ? 24 : 48)
    .lean()

  const categoryNames = new Map(categories.map((category) => [String(category._id), category.category]))
  const categorySlugs = new Map(categories.map((category) => [String(category._id), category.slug]))
  const pageLabel = selectedSubcategory?.shopSubCategory || selectedCategory?.category
  const productSections = selectedCategory || selectedSubcategory || categorySlug || subcategorySlug
    ? [{
      id: selectedCategory?._id || selectedSubcategory?._id || 'filtered-products',
      name: pageLabel || 'Products',
      slug: selectedCategory?.slug || '',
      products,
    }]
    : categories.map((category) => ({
      ...category,
      name: category.category,
      products: products.filter((product) => String(product.category) === String(category._id)),
    })).filter((section) => section.products.length)

  return (
    <div className='mt-8 '>
      <section className='flex items-center justify-center px-6 py-16 sm:py-20'>
        <div className='flex w-full max-w-4xl flex-col items-center text-center'>
          <p className='mb-3 flex items-center justify-center text-[11px] font-medium uppercase tracking-[3px] text-pink-900'>
            <Minus aria-hidden='true' /> Thoughtful Finds for Every Celebration <Minus aria-hidden='true' />
          </p>
          <h1 className='mb-5 text-4xl font-light leading-tight text-pink-900 sm:text-6xl md:text-7xl'>
            Find the Perfect <span className={`${playfair.className} font-semibold italic text-pink-900`}>Gift</span>
          </h1>
          <p className='max-w-2xl text-sm leading-relaxed text-pink-900 sm:text-base'>
            Explore cakes, baskets, cards, and more from Eventsora Shop.
          </p>
        </div>
      </section>

      <section id='shop-categories' className='md:mt-10 mt-5 scroll-mt-24'>
        <div className='flex items-center justify-center'>
          <h2 className={`${playfair.className} text-4xl font-extrabold text-pink-900 underline decoration-1 underline-offset-8 sm:text-5xl lg:text-6xl`}>
            Categories
          </h2>
        </div>
        {categories.length ? (
          <div className='mt-8 flex flex-wrap items-start justify-center gap-x-8 gap-y-6 px-5 font-bold sm:gap-x-10'>
            {categories.map((category) => {
              const categorySubcategories = subcategories.filter((subcategory) => (
                String(subcategory.shopCategory) === String(category._id)
              ))

              return (
                <div key={category._id} className='flex min-w-24 flex-col items-center text-center'>
                  <Link
                    href={SHOP_CATEGORY(category.slug)}
                    className='flex flex-col items-center gap-2 text-pink-900 transition-transform hover:-translate-y-1 hover:text-white'
                  >
                    <lord-icon
                      src={getCategoryIcon(category)}
                      trigger='loop'
                      delay='2000'
                      colors='primary:#fce5f0,secondary:#7a0e3a'
                      style={{ width: 'clamp(70px, 10vw, 100px)', height: 'clamp(70px, 10vw, 100px)' }}
                      aria-hidden='true'
                    />
                    <span className='max-w-36 text-xs uppercase sm:text-sm'>{category.category}</span>
                  </Link>
                  {categorySubcategories.length > 0 && (
                    <ul className='mt-2 space-y-1'>
                      {categorySubcategories.map((subcategory) => (
                        <li key={subcategory._id}>
                          <Link
                            href={`${SHOP_CATEGORY(category.slug)}?subcategory=${encodeURIComponent(subcategory.slug)}`}
                            className='text-xs font-normal text-pink-100 hover:text-white hover:underline'
                          >
                            {subcategory.shopSubCategory}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className='mt-8 text-center text-sm text-pink-100'>No shop categories have been added yet.</p>
        )}
      </section>

      <section id='shop-products' className='xl:px-16 lg:px-10 md:px-6 px-6'>
        {productSections.map((section) => (
          <div key={String(section.id)} className='my-5'>
            <div className='flex items-center justify-between md:mb-2 md:mt-20 mt-10'>
              <h2 className={`${playfair.className} text-3xl font-bold text-pink-900 md:text-4xl`}>
                {section.name}
              </h2>
              {!selectedCategory && !selectedSubcategory && !categorySlug && !subcategorySlug ? (
                <Link
                  href={SHOP_CATEGORY(section.slug)}
                  className='flex items-center gap-2 text-sm text-pink-100 underline underline-offset-4 transition-all hover:translate-x-2 hover:text-white md:text-lg'
                >
                  View All <ArrowRight size={20} aria-hidden='true' />
                </Link>
              ) : (
                <Link href={SHOP} className='flex items-center gap-2 text-sm text-pink-100 underline underline-offset-4 hover:text-white md:text-lg'>
                  Clear Filter <ArrowRight size={20} aria-hidden='true' />
                </Link>
              )}
            </div>
            {section.products.length ? (
              <HorizontalScrollContainer>
                {section.products.map((product) => (
                  <ProductBox
                    key={product._id.toString()}
                    product={product}
                    categoryName={categoryNames.get(String(product.category))}
                    categorySlug={categorySlugs.get(String(product.category))}
                    className='w-72 shrink-0'
                  />
                ))}
              </HorizontalScrollContainer>
            ) : (
              <p className='py-4 text-sm text-pink-100'>No approved products in this category yet.</p>
            )}
          </div>
        ))}
        {!productSections.length && (
          <p className='mt-10 text-center text-sm text-pink-100'>No approved products are available yet.</p>
        )}
      </section>
    </div>
  )
}

export default page
