import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { RecommendationCard } from '../../components/RecommendationCard';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { PokemonInfo } from './ui/PokemonInfo';
import { SearchBar } from '../../components/SearchBar';
import { getPokemonByTerm, getRecommendationAgainst } from '../../actions';

export const PokemonPage = () => {
  const { nameOrId = '' } = useParams();

  const {
    data: pokemon,
    isLoading,
    error,
    isError
  } = useQuery({
      queryKey: ['pokemon', nameOrId],
      queryFn: () => getPokemonByTerm(nameOrId),
      staleTime: 1000 * 60 * 60 * 2, // 2 hours
  });

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
  } = useQuery({
    queryKey: ['pokemon', nameOrId, 'recommendations'],
    queryFn: () => getRecommendationAgainst(pokemon!),
    enabled: !!pokemon,
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
  });


  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            className="text-4xl font-bold text-gray-800 hover:underline"
          >
            Pokédex
          </Link>

          <SearchBar initialValue={ nameOrId } />

          {isError &&
            <div className="text-red-500 font-semibold">
              { JSON.stringify(error) }
            </div>
          }

          {isLoading && <FullScreenLoading />}

          {pokemon && <PokemonInfo pokemon={ pokemon } />}

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Pokémon Recomendados
            </h3>

            {isRecommendationsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-red-300"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendations?.map((rec) => (
                    <RecommendationCard key={rec.id} pokemon={rec} />
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
