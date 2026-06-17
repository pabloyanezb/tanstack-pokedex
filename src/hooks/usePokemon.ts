import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPokemonByTerm, getRecommendationAgainst } from '../actions';

export const usePokemon = (nameOrId: string) => {
  const queryClient = useQueryClient();

  const {
    data: pokemon,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: async () => {
      const data = await getPokemonByTerm(nameOrId);
      queryClient.setQueryData(['pokemon', data.name], data);
      queryClient.setQueryData(['pokemon', data.id], data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: recommendations = [], isLoading: isRecommendationsLoading } =
    useQuery({
      queryKey: ['pokemon', nameOrId, 'recommendations'],
      queryFn: async () => {
        const data = await getRecommendationAgainst(pokemon!);
        queryClient.setQueryData(['pokemon', pokemon!.name, 'recommendations'], data);
        queryClient.setQueryData(['pokemon', pokemon!.id, 'recommendations'], data);
        return data;
      },
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
