import { useQuery } from '@tanstack/react-query';
import { getPokemonByTerm, getRecommendationAgainst } from '../actions';

export const usePokemon = (nameOrId: string) => {
  const {
    data: pokemon,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => getPokemonByTerm(nameOrId),
    staleTime: 1000 * 60 * 5,
  });

  const { data: recommendations = [], isLoading: isRecommendationsLoading } =
    useQuery({
      queryKey: ['pokemon', nameOrId, 'recommendations'],
      queryFn: () => getRecommendationAgainst(pokemon!),
      enabled: !!pokemon,
      staleTime: 1000 * 60 * 5,
  });

  return {
    pokemon,
    isError,
    isLoading,
    error,
    recommendations,
    isRecommendationsLoading,
  };
};
