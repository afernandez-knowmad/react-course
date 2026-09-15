import { CustomPagination } from "@/components/custom/CustomPagination"
import { products } from "@/mocks/products.mocks"
import { CustomJumbotron } from "@/shop/components/CustomJumbotron"
import { ProductsGrid } from "@/shop/components/ProductsGrid"

export const HomePage = () => {
    return (
        <>
            <CustomJumbotron title="Mimi" subTitle="Ropa inspirada en el diseño minimalista y la innovación de Tesla." />
            <ProductsGrid products={products} />
            <CustomPagination totalPages={7} />
        </>
    )
}
