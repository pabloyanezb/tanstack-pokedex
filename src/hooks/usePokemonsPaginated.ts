import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { getPokemonsByPage } from '../actions';

export const usePokemonsPaginated = () => {
  const [searchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = pageParam > 0 ? pageParam : 1;

  const { data, isLoading } = useQuery({
    queryKey: ['pokemons', 'page', currentPage],
    queryFn: () => getPokemonsByPage({ currentPage }),
    staleTime: 1000 * 60 * 5,
  });

  const pokemons = data?.pokemons ?? [];
  const totalPages = data?.totalPages ?? 0;

  return {
    pokemons,
    totalPages,
    currentPage,
    isLoading,
  };
};
