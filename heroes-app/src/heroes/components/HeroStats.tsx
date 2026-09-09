import { Badge } from '@/components/ui/badge';
import { Users, Heart, Zap } from 'lucide-react';
import { HeroStatCard } from './HeroStatCard';
import { useQuery } from '@tanstack/react-query';
import { getSummaryAction } from '../actions/get-summary.action';


export const HeroStats = () => {

  const { data: summaryResponse } = useQuery({
    queryKey: ['summary-information'], // Los argumentos de la funcion deberian ser siempre queryKeys
    queryFn: () => getSummaryAction(),
    staleTime: 1000 * 60 * 5 // 5 minutos
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">
          {summaryResponse?.totalHeroes}
        </div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {summaryResponse?.heroCount} Heroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {summaryResponse?.villainCount} Villains
          </Badge>
        </div>
      </HeroStatCard>

      <HeroStatCard
        title="Favoritos"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold text-red-600">3</div>
        <p className="text-xs text-muted-foreground">18.8% of total</p>
      </HeroStatCard>

      <HeroStatCard
        title="Fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">
          {summaryResponse?.strongestHero.alias}
        </div>
        <p className="text-xs text-muted-foreground">Strength:
          {summaryResponse?.strongestHero.strength} / 10
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Inteligente"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">
          {summaryResponse?.smartestHero.alias}
        </div>
        <p className="text-xs text-muted-foreground">Intelligence:
          {summaryResponse?.smartestHero.intelligence} / 10
        </p>
      </HeroStatCard>
    </div>
  );
};
