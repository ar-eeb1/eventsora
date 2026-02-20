// 'use client'
// import React from 'react'
// import { CldUploadWidget } from 'next-cloudinary'
// import { Button } from '@/components/ui/button'
// import { Plus } from 'lucide-react'
// import { showToast } from '@/lib/showToast'
// import axios from 'axios'

// const UploadMedia = ({ isMultiple }) => {

//     const handleOnError = (error) => {
//         showToast('error', error.statusText)
//     }
//     const handleOnQueueEnd = async (results) => {
//         const files = results.info.files
//         const uploadedFiles = files.filter(file => file.uploadInfo).map(file => ({
//             asset_id: file.uploadInfo.asset_id,
//             public_id: file.uploadInfo.public_id,
//             secure_url: file.uploadInfo.secure_url,
//             path: file.uploadInfo.path,
//             thumbnail_url: file.uploadInfo.thumbnail_url,
//         }))
//         if (uploadedFiles.length > 0) {
//             try {
//                 const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles)
//                 if (!mediaUploadResponse.success) {
//                     throw new Error(mediaUploadResponse.message)
//                 }

//                 showToast('success', mediaUploadResponse.message)
//             } catch (error) {
//                 showToast('error', error.message)
//             }
//         }
//     }


//     return (
//         <CldUploadWidget
//             signatureEndpoint="/api/cloudinary-signature"
//             uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//             onError={handleOnError}
//             onQueuesEnd={handleOnQueueEnd}
//             config={{
//                 cloud: {
//                     cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//                     apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//                 }
//             }}
//             options={{
//                 multiple: isMultiple,
//                 sources: ['local', 'url', 'google_drive']
//             }}
//         >

//             {({ open }) => {
//                 return (
//                     <Button className="button cursor-pointer" onClick={() => open()}>
//                         <Plus />
//                         Upload Media
//                     </Button>
//                 )
//             }}
//         </CldUploadWidget>
//     )
// }

// export default UploadMedia

'use client'
import React, { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Upload, X, File, Image, Video } from 'lucide-react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const UploadMedia = ({ isMultiple, queryClient }) => {
    const [showCustomUI, setShowCustomUI] = useState(false)

    const handleOnError = (error) => {
        showToast('error', error.statusText)
    }

    const handleOnQueueEnd = async (results) => {
        const files = results.info.files
        const uploadedFiles = files.filter(file => file.uploadInfo).map(file => ({
            asset_id: file.uploadInfo.asset_id,
            public_id: file.uploadInfo.public_id,
            secure_url: file.uploadInfo.secure_url,
            path: file.uploadInfo.path,
            thumbnail_url: file.uploadInfo.thumbnail_url,
        }))
        if (uploadedFiles.length > 0) {
            try {
                const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles)
                if (!mediaUploadResponse.success) {
                    throw new Error(mediaUploadResponse.message)
                }
                queryClient.invalidateQueries(['media-data'])
                showToast('success', mediaUploadResponse.message)
                setShowCustomUI(false)
            } catch (error) {
                showToast('error', error.message)
            }
        }
    }

    return (
        <>
            <Button
                onClick={() => setShowCustomUI(true)}
                className="bg-pink-700 text-white cursor-pointer font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <Upload className="w-5 h-5 mr-2 " />
                Upload Media
            </Button>

            {showCustomUI && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-pink-600 p-6 flex items-center justify-between cursor-pointer">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Upload className="w-6 h-6" />
                                Upload Your Files
                            </h2>
                            <button
                                onClick={() => setShowCustomUI(false)}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <p className="text-gray-600 mb-6 text-center">
                                Choose how you'd like to upload your {isMultiple ? 'files' : 'file'}
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary-signature"
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                    onError={handleOnError}
                                    onQueuesEnd={handleOnQueueEnd}
                                    config={{
                                        cloud: {
                                            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                                            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                                        }
                                    }}
                                    options={{
                                        multiple: isMultiple,
                                        sources: ['local']
                                    }}
                                >
                                    {({ open }) => (
                                        <button
                                            onClick={() => open()}
                                            className="group border-2 border-dashed cursor-pointer border-blue-300 hover:border-blue-500 rounded-xl p-8 transition-all hover:bg-blue-50"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-4 transition-colors">
                                                    <File className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-lg text-gray-800">Upload from Computer</h3>
                                                <p className="text-sm text-gray-500">Browse your local files</p>
                                            </div>
                                        </button>
                                    )}
                                </CldUploadWidget>

                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary-signature"
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                    onError={handleOnError}
                                    onQueuesEnd={handleOnQueueEnd}
                                    config={{
                                        cloud: {
                                            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                                            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                                        }
                                    }}
                                    options={{
                                        multiple: isMultiple,
                                        sources: ['url']
                                    }}
                                >
                                    {({ open }) => (
                                        <button
                                            onClick={() => open()}
                                            className="group border-2 cursor-pointer border-dashed border-purple-300 hover:border-purple-500 rounded-xl p-8 transition-all hover:bg-purple-50"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-4 transition-colors">
                                                    <Image className="w-8 h-8 text-purple-600" />
                                                </div>
                                                <h3 className="font-semibold text-lg text-gray-800">Upload from URL</h3>
                                                <p className="text-sm text-gray-500">Paste a link to your file</p>
                                            </div>
                                        </button>
                                    )}
                                </CldUploadWidget>

                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary-signature"
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                    onError={handleOnError}
                                    onQueuesEnd={handleOnQueueEnd}
                                    config={{
                                        cloud: {
                                            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                                            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                                        }
                                    }}
                                    options={{
                                        multiple: isMultiple,
                                        sources: ['google_drive']
                                    }}
                                >
                                    {({ open }) => (
                                        <button
                                            onClick={() => open()}
                                            className="group cursor-pointer border-2 border-dashed border-green-300 hover:border-green-500 rounded-xl p-8 transition-all hover:bg-green-50"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-green-100 group-hover:bg-green-200 rounded-full p-4 transition-colors">
                                                    <Video className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h3 className="font-semibold text-lg text-gray-800">Upload from Google Drive</h3>
                                                <p className="text-sm text-gray-500">Connect your Google Drive</p>
                                            </div>
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UploadMedia