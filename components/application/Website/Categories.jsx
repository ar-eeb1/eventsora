import React, { useEffect, useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'
import useFetch from '@/hooks/useFetch'
import { WEBSITE_CATEGORY } from '@/routes/WebsiteRoute'


const Categories = () => {
    const [categoryList, setCategoryList] = useState([])
    const [subcategoryList, setSubcategoryList] = useState([])

    const { data: categoryData } = useFetch('/api/website/category')
    const { data: subcategoryData } = useFetch('/api/website/subcategory');

    useEffect(() => {
        if (categoryData?.data) {
            setCategoryList(categoryData.data)
        }
    }, [categoryData])

    useEffect(() => {
        if (subcategoryData?.data) {
            setSubcategoryList(subcategoryData.data)
        }
    }, [subcategoryData])



    return (
        <div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem className="">
                        <NavigationMenuTrigger className=' bg-[#CE416F] h-0 hover:text-white '>
                            Categories
                        </NavigationMenuTrigger>

                        <NavigationMenuContent className='shadow-none'>
                            <div className='grid grid-cols-2 gap-4 p-4 min-w-[350px]'>
                                {categoryList.map((cat) => (
                                    <div key={cat._id}>
                                        <Link href={WEBSITE_CATEGORY(`${cat.slug}`)} className='font-semibold mb-2'>
                                            {cat.category}
                                        </Link>

                                        <ul className='space-y-1'>
                                            {subcategoryList
                                                .filter(sub => sub.category?._id === cat._id)
                                                .map(sub => (
                                                    <li key={sub._id} className='text-sm font-light'>
                                                        <NavigationMenuLink asChild>
                                                            <Link href=''>
                                                                {sub.subcategory}
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
        </div>
    )
}

export default Categories



//         <NavigationMenu>
//             <NavigationMenuList>
//                 <NavigationMenuItem className="hidden md:block">
//                     <NavigationMenuTrigger className="bg-[#CE416F] h-0 hover:text-white">
//                         Category
//                     </NavigationMenuTrigger>

//                     {/* ✅ SINGLE CONTENT */}
//                     <NavigationMenuContent className="shadow-none">
//                         <div className="grid grid-cols-2 gap-4 p-4 min-w-[350px]">

//                             {categoryList.map((cat) => (
//                                 <div key={cat._id}>
//                                     <h3 className="font-semibold mb-2">
//                                         {cat.category}
//                                     </h3>

//                                     <ul className="space-y-1">
//                                         {subcategoryList
//                                             .filter(sub => sub.category === cat._id)
//                                             .map(sub => (
//                                                 <li key={sub._id} className="text-sm font-light">
//                                                     <NavigationMenuLink asChild>
//                                                         <Link href={`/categories/${cat.slug}/${sub.slug}`}>
//                                                             {sub.subcategory}
//                                                         </Link>
//                                                     </NavigationMenuLink>
//                                                 </li>
//                                             ))}
//                                     </ul>
//                                 </div>
//                             ))}

//                         </div>
//                     </NavigationMenuContent>

//                 </NavigationMenuItem>
//             </NavigationMenuList>
//         </NavigationMenu>
//     )
// }

// export default Categories