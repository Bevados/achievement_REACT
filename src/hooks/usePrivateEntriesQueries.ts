import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type {
  CollectionView,
  CreateEntryDto,
  EntryView,
  PaginatedResult,
  UpdateEntryDto,
} from '../../contracts/collection.contracts';
import {
  createEntry,
  deleteEntry,
  getCollectionEntries,
  updateEntry,
} from '../api/collections.api';
import { privateCollectionKeys } from './usePrivateCollectionsQueries';
import type { EntriesQuery } from './query.types';

export function useCollectionEntriesQuery(
  collectionId: string,
  query: EntriesQuery,
): UseQueryResult<PaginatedResult<EntryView>, Error> {
  return useQuery({
    queryKey: privateCollectionKeys.entriesList(collectionId, query),
    queryFn: () => getCollectionEntries(collectionId, query),
    enabled: Boolean(collectionId),
  });
}

async function invalidateEntryScope(queryClient: ReturnType<typeof useQueryClient>, collectionId: string) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: privateCollectionKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: privateCollectionKeys.detail(collectionId) }),
    queryClient.invalidateQueries({ queryKey: privateCollectionKeys.entries(collectionId) }),
  ]);
}

function removeDeletedEntryFromEntriesCache(
  current: PaginatedResult<EntryView> | undefined,
  entryId: string,
): PaginatedResult<EntryView> | undefined {
  if (!current) {
    return current;
  }

  const nextItems = current.items.filter((entry) => entry.id !== entryId);
  if (nextItems.length === current.items.length) {
    return current;
  }

  return {
    ...current,
    items: nextItems,
    meta: {
      ...current.meta,
      total: Math.max(0, current.meta.total - 1),
    },
  };
}

function decrementEntriesCount(current: CollectionView | undefined): CollectionView | undefined {
  if (!current) {
    return current;
  }

  return {
    ...current,
    entriesCount: Math.max(0, current.entriesCount - 1),
  };
}

export function useCreateEntryMutation(): UseMutationResult<
  EntryView,
  Error,
  { collectionId: string; payload: CreateEntryDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, payload }) => createEntry(collectionId, payload),
    onSuccess: async (_data, variables) => {
      await invalidateEntryScope(queryClient, variables.collectionId);
    },
  });
}

export function useUpdateEntryMutation(): UseMutationResult<
  EntryView,
  Error,
  { collectionId: string; entryId: string; payload: UpdateEntryDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, entryId, payload }) => updateEntry(collectionId, entryId, payload),
    onSuccess: async (_data, variables) => {
      await invalidateEntryScope(queryClient, variables.collectionId);
    },
  });
}

export function useDeleteEntryMutation(): UseMutationResult<
  null,
  Error,
  { collectionId: string; entryId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, entryId }) => deleteEntry(collectionId, entryId),
    onSuccess: async (_data, variables) => {
      queryClient.setQueriesData<PaginatedResult<EntryView>>(
        { queryKey: privateCollectionKeys.entries(variables.collectionId) },
        (current) => removeDeletedEntryFromEntriesCache(current, variables.entryId),
      );
      queryClient.setQueryData<CollectionView>(
        privateCollectionKeys.detail(variables.collectionId),
        (current) => decrementEntriesCount(current),
      );
      queryClient.setQueriesData<PaginatedResult<CollectionView>>(
        { queryKey: privateCollectionKeys.lists() },
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            items: current.items.map((collection) =>
              collection.id === variables.collectionId ? decrementEntriesCount(collection)! : collection,
            ),
          };
        },
      );

      await invalidateEntryScope(queryClient, variables.collectionId);
    },
  });
}
