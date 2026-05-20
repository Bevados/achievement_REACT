import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  CollectionView,
  CreateCollectionDto,
  PaginatedResult,
  UpdateCollectionDto,
} from '../../contracts/collection.contracts';
import {
  createCollection,
  deleteCollection,
  getCollectionById,
  getOwnerCollections,
  updateCollection,
} from '../api/collections.api';
import type { CollectionsQuery, EntriesQuery } from './query.types';

export const privateCollectionKeys = {
  all: ['private-collections'] as const,
  lists: () => [...privateCollectionKeys.all, 'list'] as const,
  list: (query: CollectionsQuery) => [...privateCollectionKeys.lists(), query] as const,
  details: () => [...privateCollectionKeys.all, 'detail'] as const,
  detail: (collectionId: string) => [...privateCollectionKeys.details(), collectionId] as const,
  entries: (collectionId: string) =>
    [...privateCollectionKeys.detail(collectionId), 'entries'] as const,
  entriesList: (collectionId: string, query: EntriesQuery) =>
    [...privateCollectionKeys.entries(collectionId), query] as const,
};

export function useCollectionsQuery(
  query: CollectionsQuery,
): UseQueryResult<PaginatedResult<CollectionView>, Error> {
  return useQuery({
    queryKey: privateCollectionKeys.list(query),
    queryFn: () => getOwnerCollections(query),
  });
}

export function useCollectionDetailQuery(
  collectionId: string,
): UseQueryResult<CollectionView, Error> {
  return useQuery({
    queryKey: privateCollectionKeys.detail(collectionId),
    queryFn: () => getCollectionById(collectionId),
    enabled: Boolean(collectionId),
  });
}

async function invalidateCollectionScope(queryClient: ReturnType<typeof useQueryClient>, collectionId?: string) {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: privateCollectionKeys.lists() }),
  ];

  if (collectionId) {
    invalidations.push(
      queryClient.invalidateQueries({ queryKey: privateCollectionKeys.detail(collectionId) }),
      queryClient.invalidateQueries({ queryKey: privateCollectionKeys.entries(collectionId) }),
    );
  }

  await Promise.all(invalidations);
}

export function useCreateCollectionMutation(): UseMutationResult<
  CollectionView,
  Error,
  CreateCollectionDto
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollection,
    onSuccess: async () => {
      await invalidateCollectionScope(queryClient);
    },
  });
}

export function useUpdateCollectionMutation(): UseMutationResult<
  CollectionView,
  Error,
  { collectionId: string; payload: UpdateCollectionDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, payload }) => updateCollection(collectionId, payload),
    onSuccess: async (_data, variables) => {
      await invalidateCollectionScope(queryClient, variables.collectionId);
    },
  });
}

export function useDeleteCollectionMutation(): UseMutationResult<
  null,
  Error,
  { collectionId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId }) => deleteCollection(collectionId),
    onSuccess: async (_data, variables) => {
      await invalidateCollectionScope(queryClient, variables.collectionId);
    },
  });
}
