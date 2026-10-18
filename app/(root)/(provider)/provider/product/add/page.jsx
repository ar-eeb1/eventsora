"use client";

import BreadCrumb from "@/components/application/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import Editor from "@/components/application/Provider/Editor";
import MediaModal from "@/components/application/Provider/MediaModal";
import UploadMedia from "@/components/application/Provider/UploadMedia";
import Select from "@/components/application/Main/Select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { productFormSchema } from "@/lib/zodSchema";
import {
  PROVIDER_DASHBOARD,
  PROVIDER_PRODUCT_SHOW,
} from "@/routes/ProviderPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { Images, X } from "lucide-react";
// import ShopSubcategoryModel from "@/models/ShopSubcategory.model";
// import ShopCategoryModel from "@/models/ShopCategory.model";

const breadCrumbData = [
  {
    href: PROVIDER_DASHBOARD,
    label: "Dashboard",
  },
  {
    href: PROVIDER_PRODUCT_SHOW,
    label: "Products",
  },
  {
    href: "",
    label: "Add Product",
  },
];

const AddProduct = () => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(productFormSchema),

    defaultValues: {
      name: "",
      slug: "",
      category: "",
      subcategory: "",
      price: 0,
      sku: "",
      discountPercentage: 0,
      stockType: "in_stock",
      stockQuantity: 0,
      minimumOrderQuantity: 1,
      processingValue: 0,
      processingUnit: "days",
      customizable: false,
      description: "",
      country: "",
      state: "",
      city: "",
      tags: "",
      inquirePrice: false,
    },
  });

  const selectedCategory = form.watch("category");
  const selectedCountry = form.watch("country");
  const selectedState = form.watch("state");
  const productName = form.watch("name");
  const stockType = form.watch("stockType");

  useEffect(() => {
    if (stockType === "made_to_order") {
      form.setValue("stockQuantity", 0, { shouldValidate: true });
    }
  }, [stockType, form]);

  const { data: countryData } = useFetch(
    "/api/master/location/country?deleteType=SD&&size=1000"
  );

  const { data: stateData } = useFetch(
    "/api/master/location/state?deleteType=SD&&size=1000"
  );

  const { data: cityData } = useFetch(
    "/api/master/location/city?deleteType=SD&&size=1000"
  );

  // Fetch shop categories
  useEffect(() => {
    axios
      .get("/api/provider/shop-category")
      .then(({ data }) => {
        setCategories(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => {
        showToast(
          "error",
          error.response?.data?.message || error.message
        );
      });
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    form.setValue("subcategory", "");

    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }

    axios
      .get(
        `/api/provider/shop-subcategory?categoryId=${selectedCategory}`
      )
      .then(({ data }) => {
        setSubcategories(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => {
        showToast(
          "error",
          error.response?.data?.message || error.message
        );
      });
  }, [selectedCategory, form]);

  // Generate slug from product name
  useEffect(() => {
    if (productName) {
      form.setValue(
        "slug",
        slugify(productName).toLowerCase()
      );
    }
  }, [productName, form]);

  // Convert API data into select options
  const options = (data, label) =>
    (data?.success ? data.data : []).map((item) => ({
      label: item[label],
      value: item._id,
    }));

  const countryOptions = options(countryData, "country");

  const stateOptions = options(stateData, "state").filter(
    (item) =>
      stateData?.data?.find(
        (entry) => entry._id === item.value
      )?.countryId === selectedCountry
  );

  const cityOptions = options(cityData, "city").filter(
    (item) =>
      cityData?.data?.find(
        (entry) => entry._id === item.value
      )?.stateId === selectedState
  );

  // Reusable select field
  const renderSelect = (
    name,
    label,
    options,
    placeholder
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Select
              options={options}
              selected={field.value}
              setSelected={field.onChange}
              isMulti={false}
              placeholder={placeholder}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Submit product
  const onSubmit = async (values) => {
    if (!selectedMedia.length) {
      return showToast(
        "error",
        "Please select at least one product image"
      );
    }

    setLoading(true);

    try {
      const payload = {
        ...values,

        media: selectedMedia.map((media) => media._id),

        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],

        processingTime: {
          value: values.processingValue,
          unit: values.processingUnit,
        },
        stockQuantity: values.stockType === "in_stock" ? values.stockQuantity : 0,
      };

      delete payload.processingValue;
      delete payload.processingUnit;

      const { data } = await axios.post(
        "/api/provider/product/create",
        payload
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      form.reset();
      setSelectedMedia([]);

      showToast("success", data.message);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-[calc(100%-1%)]">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="overflow-hidden rounded-xl border-0 shadow-lg">
        <CardHeader className="border-b px-3 [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">
            Add Product
          </h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Basic Information */}
              <section className="space-y-6">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">
                  Basic Information
                </h5>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Product Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product Name
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            disabled
                            className="bg-gray-50"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  {renderSelect(
                    "category",
                    "Shop Category",
                    categories.map((item) => ({
                      label: item.category,
                      value: item._id,
                    })),
                    "Select category"
                  )}

                  {/* Subcategory */}
                  {renderSelect(
                    "subcategory",
                    "Shop Subcategory",
                    subcategories.map((item) => ({
                      label: item.shopSubCategory,
                      value: item._id,
                    })),
                    "Select subcategory"
                  )}

                  {/* SKU */}
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          SKU
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="e.g. PROD-001"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount */}
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentage
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stock Type */}
                  <FormField
                    control={form.control}
                    name="stockType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Stock Type
                        </FormLabel>

                        <FormControl>
                          <Select
                            options={[
                              {
                                label: "In Stock",
                                value: "in_stock",
                              },
                              {
                                label: "Made to Order",
                                value: "made_to_order",
                              },
                            ]}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder="Select stock type"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {stockType === "in_stock" && (
                    <FormField
                      control={form.control}
                      name="stockQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="minimumOrderQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Processing Value */}
                  <FormField
                    control={form.control}
                    name="processingValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Processing Time
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Processing Unit */}
                  <FormField
                    control={form.control}
                    name="processingUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Processing Unit
                        </FormLabel>

                        <FormControl>
                          <Select
                            options={[
                              {
                                label: "Hours",
                                value: "hours",
                              },
                              {
                                label: "Days",
                                value: "days",
                              },
                            ]}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder="Select unit"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tags
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="wedding, decor, handmade"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Customizable */}
                  <FormField
                    control={form.control}
                    name="customizable"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <div>
                          <FormLabel>
                            Customizable Product
                          </FormLabel>

                          <p className="text-xs text-muted-foreground">
                            Allow customers to request changes.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Inquire Price */}
                  <FormField
                    control={form.control}
                    name="inquirePrice"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <div>
                          <FormLabel>
                            Inquire Price
                          </FormLabel>

                          <p className="text-xs text-muted-foreground">
                            Ask customers to contact you for pricing.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Location Information */}
              <section className="space-y-6">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">
                  Location Information
                </h5>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {renderSelect(
                    "country",
                    "Country",
                    countryOptions,
                    "Select country"
                  )}

                  {renderSelect(
                    "state",
                    "State",
                    stateOptions,
                    "Select state"
                  )}

                  {renderSelect(
                    "city",
                    "City",
                    cityOptions,
                    "Select city"
                  )}
                </div>
              </section>

              {/* Description */}
              <section className="space-y-4">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">
                  Description
                </h5>

                <FormField
                  control={form.control}
                  name="description"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Description
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </FormLabel>

                      <FormControl>
                        <div className="overflow-hidden rounded-lg border">
                          <Editor
                            onChange={(event, editor) =>
                              form.setValue(
                                "description",
                                editor.getData(),
                                {
                                  shouldValidate: true,
                                }
                              )
                            }
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Media Gallery */}
              <section className="space-y-4">
                <h5 className="border-b-2 border-primary/20 pb-2 text-lg font-semibold">
                  Media Gallery
                </h5>

                <div className="rounded-xl border-2 border-dashed p-8 text-center">
                  {selectedMedia.length > 0 && (
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-6">
                      {selectedMedia.map((media) => (
                        <div
                          key={media._id}
                          className="group relative aspect-square overflow-hidden rounded-lg"
                        >
                          <Image
                            src={media.url}
                            alt="Product"
                            fill
                            className="object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedMedia((prev) =>
                                prev.filter(
                                  (item) =>
                                    item._id !== media._id
                                )
                              )
                            }
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-4">
                    <UploadMedia
                      isMultiple
                      queryClient={queryClient}
                      onUploadSuccess={(media) =>
                        setSelectedMedia((prev) => [
                          ...prev,
                          ...media.map((item) => ({
                            _id: item._id,
                            url: item.secure_url,
                          })),
                        ])
                      }
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setOpenMediaModal(true)
                      }
                    >
                      <Images className="mr-2 h-4 w-4" />
                      Select from Gallery
                    </Button>
                  </div>

                  <MediaModal
                    open={openMediaModal}
                    setOpen={setOpenMediaModal}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple
                  />
                </div>
              </section>

              {/* Submit */}
              <div className="flex justify-end border-t pt-6">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Create Product"
                  className="h-12 px-8"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;