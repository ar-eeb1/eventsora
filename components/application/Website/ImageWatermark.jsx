import Image from 'next/image'
import logo from '@/public/assets/eventsora.png'

const watermarkSizes = {
    small: 'h-8 w-20',
    medium: 'h-12 w-32',
    large: 'h-16 w-48',
}

const ImageWatermark = ({ size = 'large' }) => (
    <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-white/10 p-1 shadow-sm'
    >
        <Image
            src={logo}
            alt=''
            width={500}
            height={350}
            className={`${watermarkSizes[size] || watermarkSizes.medium} object-contain`}
        />
    </span>
)

export default ImageWatermark
