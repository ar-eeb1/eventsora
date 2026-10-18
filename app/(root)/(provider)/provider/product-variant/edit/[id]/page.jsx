'use client'

import BreadCrumb from '@/components/application/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import Select from '@/components/application/Main/Select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { productVariantFormSchema } from '@/lib/zodSchema'
import { PROVIDER_DASHBOARD, PROVIDER_PRODUCT_VARIANT_SHOW } from '@/routes/ProviderPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const breadCrumbData = [
    { href: PROVIDER_DASHBOARD, label: 'Dashboard' },
    { href: PROVIDER_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
    { href: '', label: 'Edit Product Variant' },
]

const EditProductVariant = () => {
    const { id } = useParams()
    const { data: productsData } = useFetch('/api/provider/products-for-variant')
    const { data: variantData, loading: variantLoading } = useFetch(id ? `/api/provider/product-variant/get/${id}` : null)
    const products = productsData?.success ? productsData.data : []
    const [loading, setLoading] = React.useState(false)
    const form = useForm({
        resolver: zodResolver(productVariantFormSchema),
        defaultValues: {
            productId: '', name: '', price: 0, sku: '', discountPercentage: 0,
            stockType: 'in_stock', stockQuantity: 0, processingValue: 0,
            processingUnit: 'days', inquirePrice: false,
        },
    })
    const stockType = form.watch('stockType')

    useEffect(() => {
        if (variantData?.success) {
            const variant = variantData.data
            form.reset({
                productId: variant.productId || variant.product?._id || '',
                name: variant.name || '', price: variant.price || 0, sku: variant.sku || '',
                discountPercentage: variant.discountPercentage || 0,
                stockType: variant.stockType || 'in_stock', stockQuantity: variant.stockQuantity || 0,
                processingValue: variant.processingTime?.value || 0,
                processingUnit: variant.processingTime?.unit || 'days', inquirePrice: !!variant.inquirePrice,
            })
        }
    }, [variantData, form])

    useEffect(() => {
        if (stockType === 'made_to_order') form.setValue('stockQuantity', 0, { shouldValidate: true })
    }, [stockType, form])

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const payload = {
                _id: id, ...values,
                stockQuantity: values.stockType === 'in_stock' ? values.stockQuantity : 0,
                processingTime: { value: values.processingValue, unit: values.processingUnit },
            }
            delete payload.processingValue
            delete payload.processingUnit
            const { data } = await axios.put('/api/provider/product-variant/update', payload)
            if (!data.success) throw new Error(data.message)
            showToast('success', data.message)
        } catch (error) {
            showToast('error', error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    const field = (name, label, props = {}) => <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input {...props} {...field} /></FormControl><FormMessage /></FormItem>} />
    if (variantLoading) return <div className='p-6'>Loading product variant...</div>

    return <div className='mx-auto w-[calc(100%-1%)]'>
        <BreadCrumb breadCrumbData={breadCrumbData} />
        <Card className='overflow-hidden rounded-xl border-0 shadow-lg'>
            <CardHeader className='border-b px-3 [.border-b]:pb-2'><h4 className='text-xl font-semibold'>Edit Product Variant</h4></CardHeader>
            <CardContent><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField control={form.control} name='productId' render={({ field }) => <FormItem><FormLabel>Product</FormLabel><FormControl><Select options={products.map((item) => ({ label: item.name, value: item._id }))} selected={field.value} setSelected={field.onChange} isMulti={false} placeholder='Select product' /></FormControl><FormMessage /></FormItem>} />
                    {field('name', 'Variant Name', { placeholder: 'e.g. Premium' })}
                    {field('sku', 'SKU', { placeholder: 'e.g. PROD-PREM-001' })}
                    {field('price', 'Price', { type: 'number', min: 0, step: '0.01' })}
                    {field('discountPercentage', 'Discount Percentage', { type: 'number', min: 0, max: 100, step: '0.01' })}
                    <FormField control={form.control} name='stockType' render={({ field }) => <FormItem><FormLabel>Stock Type</FormLabel><FormControl><Select options={[{ label: 'In Stock', value: 'in_stock' }, { label: 'Made to Order', value: 'made_to_order' }]} selected={field.value} setSelected={field.onChange} isMulti={false} placeholder='Select stock type' /></FormControl><FormMessage /></FormItem>} />
                    {stockType === 'in_stock' && field('stockQuantity', 'Stock Quantity', { type: 'number', min: 0, step: 1 })}
                    {field('processingValue', 'Processing Time', { type: 'number', min: 0, step: '0.01' })}
                    <FormField control={form.control} name='processingUnit' render={({ field }) => <FormItem><FormLabel>Processing Unit</FormLabel><FormControl><Select options={[{ label: 'Hours', value: 'hours' }, { label: 'Days', value: 'days' }]} selected={field.value} setSelected={field.onChange} isMulti={false} placeholder='Select unit' /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name='inquirePrice' render={({ field }) => <FormItem className='flex items-start gap-3 rounded-md border p-4'><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Inquire Price</FormLabel></FormItem>} />
                </div>
                <div className='flex justify-end border-t pt-6'><ButtonLoading loading={loading} type='submit' text='Update Product Variant' className='h-12 px-8' /></div>
            </form></Form></CardContent>
        </Card>
    </div>
}

export default EditProductVariant
