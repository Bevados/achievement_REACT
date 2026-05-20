import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type {
  CollectionView,
  EntryView,
  PaginatedResult,
} from '../../contracts/collection.contracts';
import {
  getPublicCollectionById,
  getPublicCollectionEntries,
  getPublicCollections,
} from '../api/collections.api';
import type { CollectionsQuery, EntriesQuery } from './query.types';

export const publicCollectionKeys = {
  all: ['public-collections'] as const,
  lists: () => [...publicCollectionKeys.all, 'list'] as const,
  list: (query: CollectionsQuery) => [...publicCollectionKeys.lists(), query] as const,
  details: () => [...publicCollectionKeys.all, 'detail'] as const,
  detail: (collectionId: string) => [...publicCollectionKeys.details(), collectionId] as const,
  entries: (collectionId: string) =>
    [...publicCollectionKeys.detail(collectionId), 'entries'] as const,
  entriesList: (collectionId: string, query: EntriesQuery) =>
    [...publicCollectionKeys.entries(collectionId), query] as const,
};

export function usePublicCollectionsQuery(
  query: CollectionsQuery,
): UseQueryResult<PaginatedResult<CollectionView>, Error> {
  return useQuery({
    queryKey: publicCollectionKeys.list(query),
    queryFn: () => getPublicCollections(query),
  });
}

export function usePublicCollectionDetailQuery(
  collectionId: string,
): UseQueryResult<CollectionView, Error> {
  return useQuery({
    queryKey: publicCollectionKeys.detail(collectionId),
    queryFn: () => getPublicCollectionById(collectionId),
    enabled: Boolean(collectionId),
  });
}

export function usePublicCollectionEntriesQuery(
  collectionId: string,
  query: EntriesQuery,
): UseQueryResult<PaginatedResult<EntryView>, Error> {
  return useQuery({
    queryKey: publicCollectionKeys.entriesList(collectionId, query),
    queryFn: () => getPublicCollectionEntries(collectionId, query),
    enabled: Boolean(collectionId),
  });
}
