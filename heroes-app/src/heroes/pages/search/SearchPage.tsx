import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { searchHeroesAction } from '@/heroes/actions/search-hero.action';
import { useSearchParams } from 'react-router';
import { HeroGrid } from '@/heroes/components/HeroGrid';

export const SearchPage = () => {

  const [searchParams] = useSearchParams();

  const name = searchParams.get('name') ?? '';

  const { data: searchData = [] } = useQuery({
    queryKey: ['search', { name }], // Los argumentos de la funcion deberian ser siempre queryKeys
    queryFn: () => searchHeroesAction({ name }),
    staleTime: 1000 * 60 * 5 // 5 minutos
  });

  return (
    <>
      <CustomJumbotron
        title="Búsqueda de SuperHéroes"
        description="Descubre, explora y administra super héroes y villanos"
      />

      <CustomBreadcrumbs
        currentPage="Buscador de héroes"
      // breadcrumbs={[
      //   { label: 'Home1', to: '/' },
      //   { label: 'Home2', to: '/' },
      //   { label: 'Home3', to: '/' },
      // ]}
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and search */}
      <SearchControls />

      {/* Filter and search */}
      <HeroGrid heroes={searchData} />
    </>
  );
};

export default SearchPage;
