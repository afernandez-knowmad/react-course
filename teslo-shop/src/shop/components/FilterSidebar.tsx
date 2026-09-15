import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router";

const FilterSidebar = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const currentSizes = searchParams.get('sizes')?.split(',') || [];
  const currentPrices = searchParams.get('prices')?.split(',') || [];

  const handleSizeChange = (size: string) => {
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];

    searchParams.set('page', '1');
    searchParams.set('sizes', newSizes.join(','));
    setSearchParams(searchParams);
  }

  const handlePriceChange = (price: string) => {
    searchParams.set('page', '1');
    if (price === 'any' || !price) {
      searchParams.delete('prices');
    } else {
      searchParams.set('prices', price);
    }
    setSearchParams(searchParams);
  }

  const categories = [
    { id: "tshirts", label: "Camisetas", count: 12 },
    { id: "hoodies", label: "Sudaderas", count: 8 },
    { id: "jackets", label: "Chaquetas", count: 6 },
    { id: "accessories", label: "Accesorios", count: 15 },
  ];

  const sizes = [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL" },
  ];

  const colors = [
    { id: "black", label: "Negro", color: "bg-black" },
    { id: "white", label: "Blanco", color: "bg-white border" },
    { id: "grey", label: "Gris", color: "bg-gray-400" },
    { id: "navy", label: "Azul Marino", color: "bg-blue-900" },
  ];

  const prices = [
    { id: "any", label: "Cualquier precio" },
    { id: "0-50", label: "$0 - $50" },
    { id: "50-100", label: "$50 - $100" },
    { id: "100-200", label: "$100 - $200" },
    { id: "200+", label: "$200+" },
  ];

  return (
    <div className="w-64 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filtros</h3>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h4 className="font-medium">Tallas</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size.id}
              // variant="outline"
              variant={currentSizes.includes(size.id) ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => handleSizeChange(size.id)}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium">Precio</h4>
        <RadioGroup
          value={searchParams.get('prices') ?? 'any'}
          onValueChange={handlePriceChange}
          className="space-y-3"
        >
          {prices.map((price) => (
            <div key={price.id} className="flex items-center space-x-2">
              <RadioGroupItem value={price.id} id={`price-${price.id}`} />
              <Label htmlFor={`price-${price.id}`} className="text-sm cursor-pointer">
                {price.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default FilterSidebar;