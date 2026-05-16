import { useMutation, useQuery, useQueryClient, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type {
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
import type { EntriesQuery } from './useEntriesListController';

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
      await invalidateEntryScope(queryClient, variables.collectionId);
    },
  });
}
