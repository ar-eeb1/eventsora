export async function generateMetadata({ params }) {
    const { category } = await params

    const formattedCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

    return {
        title: (`${formattedCategory} in Pakistan`),
        description: `Find the best ${formattedCategory} services for weddings, parties, and events across Pakistan on Eventsora.`,
    }
}
const CategoryLayout = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default CategoryLayout
