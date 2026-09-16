import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomJumbotron } from "@/shop/components/CustomJumbotron"
import { ProductsGrid } from "@/shop/components/ProductsGrid"
import { useParams } from "react-router";

export const GenderPage = () => {
    const { gender } = useParams();

    const genderLabel = gender === 'men' ? 'Hombres' : gender === 'women' ? 'Mujeres' : 'Niños';

    return (
        <>
            <CustomJumbotron title={`Productos para ${genderLabel}`} subTitle="Ropa inspirada en el diseño minimalista y la innovación de Tesla." />
            {/* <ProductsGrid products={products} /> */}
            <CustomPagination totalPages={7} />
        </>
    )
}
