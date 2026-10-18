import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/databaseConnection'
import ShopCategoryModel from '@/models/ShopCategory.model'
import ShopSubcategoryModel from '@/models/ShopSubcategory.model'
import { SHOP, SHOP_CATEGORY } from '@/routes/WebsiteRoute'
import ShopFilter from '@/components/application/Shop/ShopFilter'
import ShopCategoryProducts from './ShopCategoryProducts'

const page = async ({ params, searchParams }) => {
  const { category: categorySlug } = await params
  const query = await searchParams
  await connectDB()

  const category = await ShopCategoryModel.findOne({ slug: categorySlug, deletedAt: null }).lean()
  if (!category) notFound()

  const subcategories = await ShopSubcategoryModel.find({ shopCategory: category._id, deletedAt: null })
    .sort({ shopSubCategory: 1 })
    .lean()
  const selectedSlug = typeof query?.subcategory === 'string' ? query.subcategory : ''
  const selectedSlugs = selectedSlug.split(',').filter(Boolean)
  const selectedSubcategories = subcategories.filter((subcategory) => selectedSlugs.includes(subcategory.slug))
  const selectedSubcategory = selectedSubcategories.map((subcategory) => subcategory.shopSubCategory).join(', ')
  return (
    <main className='mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-12'>
      <nav aria-label='Breadcrumb' className='mb-6 text-sm text-gray-500'>
        <Link href={SHOP} className='hover:text-pink-900'>Shop</Link>
        <span className='px-2'>/</span>
        <span className='text-gray-900'>{category.category}</span>
      </nav>

      <div className='mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5'>
        <div>
          <p className='mb-1 text-xs font-semibold uppercase text-pink-800'>Eventsora Shop</p>
          <h1 className='text-3xl font-semibold text-gray-900'>{selectedSubcategory || category.category}</h1>
        </div>
      </div>

      <section className='mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]'>
        <ShopFilter categorySlug={category.slug} subcategories={JSON.parse(JSON.stringify(subcategories))} />
        <ShopCategoryProducts categorySlug={category.slug} categoryName={selectedSubcategory || category.category} />
      </section>
    </main>
  )
}

export default page