import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPokemonByTerm, getRecommendationAgainst } from '../actions';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const usePokemon = (nameOrId: string) => {
  const queryClient = useQueryClient();

  const fetchAndCachePokemon = async (term: string) => {
    const data = await getPokemonByTerm(term);
    queryClient.setQueryData(['pokemon', data.name], data);
    queryClient.setQueryData(['pokemon', `${data.id}`], data);
    return data;
  };

  const {
    data: pokemon,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: async () => {
      const data = await fetchAndCachePokemon(nameOrId);

      const nextId = data.id + 1;
      const prevId = data.id - 1;

      queryClient.prefetchQuery({
        queryKey: ['pokemon', `${nextId}`],
        queryFn: () => fetchAndCachePokemon(`${nextId}`),
        staleTime: STALE_TIME,
      });
      if (data.id > 1) {
        queryClient.prefetchQuery({
          queryKey: ['pokemon', `${prevId}`],
          queryFn: () => fetchAndCachePokemon(`${prevId}`),
          staleTime: STALE_TIME,
        });
      }
      return data;
    },
    staleTime: STALE_TIME,
  });

  const { data: recommendations = [], isLoading: isRecommendationsLoading } =
    useQuery({
      queryKey: ['pokemon', nameOrId, 'recommendations'],
      queryFn: async () => {
        const data = await getRecommendationAgainst(pokemon!);
        queryClient.setQueryData(['pokemon', pokemon!.name, 'recommendations'], data);
        queryClient.setQueryData(['pokemon', `${pokemon!.id}`, 'recommendations'], data);
        return data;
      },
      enabled: !!pokemon,
      staleTime: STALE_TIME,
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
