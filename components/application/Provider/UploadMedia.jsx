'use client'
import React from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const UploadMedia = ({ isMultiple = true, queryClient, onUploadSuccess }) => {

    const handleOnError = (error) => {
        showToast('error', error?.statusText || error?.message || 'Media upload failed')
    }

    const processAndSaveMedia = async (uploadedFiles) => {
        if (!uploadedFiles || uploadedFiles.length === 0) return;
        try {
            const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles)
            if (!mediaUploadResponse.success) {
                throw new Error(mediaUploadResponse.message)
            }

            if (queryClient) {
                queryClient.invalidateQueries(['media-data'])
                queryClient.invalidateQueries(['MediaModal'])
            }

            if (onUploadSuccess && mediaUploadResponse.data) {
                onUploadSuccess(mediaUploadResponse.data)
            }

            showToast('success', mediaUploadResponse.message || 'Media uploaded successfully')
        } catch (error) {
            showToast('error', error.message || 'Failed to save media')
        }
    }

    const extractFileInfo = (info) => {
        if (!info || !info.secure_url) return null;
        return {
            asset_id: info.asset_id || info.public_id,
            public_id: info.public_id,
            secure_url: info.secure_url,
            path: info.path || info.public_id,
            thumbnail_url: info.thumbnail_url || info.secure_url,
        }
    }

    const handleOnQueuesEnd = async (results) => {
        let uploadedFiles = []

        if (Array.isArray(results?.info?.files)) {
            uploadedFiles = results.info.files
                .filter(file => file?.uploadInfo?.secure_url)
                .map(file => extractFileInfo(file.uploadInfo))
                .filter(Boolean)
        } else if (results?.info?.secure_url) {
            const single = extractFileInfo(results.info)
            if (single) uploadedFiles.push(single)
        }

        if (uploadedFiles.length > 0) {
            await processAndSaveMedia(uploadedFiles)
        }
    }

    return (
        <CldUploadWidget
            signatureEndpoint="/api/cloudinary-signature"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPDATE_PRESET || 'eventsora'}
            onError={handleOnError}
            onQueuesEnd={handleOnQueuesEnd}
            config={{
                cloud: {
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                }
            }}
            options={{
                multiple: isMultiple,
                resourceType: 'image',
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'heic', 'gif', 'svg'],
                sources: ['local', 'url', 'camera']
            }}
        >
            {({ open }) => {
                return (
                    <Button
                        type="button"
                        onClick={() => open()}
                        className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Pictures
                    </Button>
                )
            }}
        </CldUploadWidget>
    )
}

export default UploadMedia