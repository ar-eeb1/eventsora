'use client'

import Link from 'next/link'
import useFetch from '@/hooks/useFetch'
import { SHOP_CATEGORY } from '@/routes/WebsiteRoute'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const Categories = ({ onItemClick }) => {
    const { data: categoryData } = useFetch('/api/website/shop-category')
    const { data: subcategoryData } = useFetch('/api/website/shop-subcategory')
    const categories = categoryData?.data ?? []
    const subcategories = subcategoryData?.data ?? []

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className='h-auto bg-transparent px-0 text-inherit hover:bg-transparent'>
                        Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className='grid min-w-87.5 grid-cols-2 gap-4 p-4'>
                            {categories.map((category) => (
                                <div key={category._id}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={SHOP_CATEGORY(category.slug)}
                                            className='mb-2 font-semibold capitalize'
                                            onClick={onItemClick}
                                        >
                                            {category.category}
                                        </Link>
                                    </NavigationMenuLink>
                                    <ul className='space-y-1'>
                                        {subcategories
                                            .filter((subcategory) => String(subcategory.shopCategory) === String(category._id))
                                            .map((subcategory) => (
                                                <li key={subcategory._id} className='text-sm font-light'>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href={`${SHOP_CATEGORY(category.slug)}?subcategory=${encodeURIComponent(subcategory.slug)}`}
                                                            onClick={onItemClick}
                                                        >
                                                            {subcategory.shopSubCategory}
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Categories