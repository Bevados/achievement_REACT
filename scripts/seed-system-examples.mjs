import { config as loadEnv } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

const OWNER_ID = 'system_examples';
const COLLECTIONS_COUNT = 18;
const DEFAULT_ENTRIES_PER_COLLECTION = 14;

const COLLECTION_CATEGORIES = [
  'travel',
  'sport',
  'shopping',
  'learning',
  'health_body',
  'creativity',
  'hobby',
  'career',
  'family',
  'home',
  'self_development',
  'other',
];

const ENTRY_STATUSES = ['planned', 'in_progress', 'completed'];

const OPTIONAL_ENTRY_FIELDS = [
  'description',
  'imageUrl',
  'priceCents',
  'tags',
  'rating',
  'dateStart',
  'dateRange',
];

function buildCollectionDoc(index) {
  const createdAt = new Date(Date.UTC(2026, 0, 1 + index, 9, 0, 0));
  const updatedAt = new Date(Date.UTC(2026, 0, 2 + index, 14, 30, 0));

  const doc = {
    _id: new ObjectId(),
    ownerId: OWNER_ID,
    title: `System Example Collection ${String(index + 1).padStart(2, '0')}`,
    category: COLLECTION_CATEGORIES[index % COLLECTION_CATEGORIES.length],
    isPublic: true,
    entriesCount: 0,
    createdAt,
    updatedAt,
  };

  const optionalPattern = index % 4;

  if (optionalPattern === 1 || optionalPattern === 3) {
    doc.description = `Описание для коллекции ${index + 1}. Используется как seed-данные examples.`;
  }

  if (optionalPattern === 2 || optionalPattern === 3) {
    doc.coverImageUrl = `https://images.unsplash.com/photo-15${70000000000 + index}?auto=format&fit=crop&w=1200&q=80`;
  }

  return doc;
}

function buildEntryBase({ collectionId, collectionIndex, entryIndex, variantLabel }) {
  const createdAt = new Date(Date.UTC(2026, 1, (entryIndex % 26) + 1, 10, 0, 0));
  const updatedAt = new Date(Date.UTC(2026, 1, (entryIndex % 26) + 1, 16, 0, 0));

  return {
    ownerId: OWNER_ID,
    collectionId,
    title: `Entry ${String(entryIndex + 1).padStart(2, '0')} · C${collectionIndex + 1} · ${variantLabel}`,
    status: ENTRY_STATUSES[entryIndex % ENTRY_STATUSES.length],
    createdAt,
    updatedAt,
  };
}

function buildOptionalEntryFields(entryIndex) {
  return {
    description: `Описание карточки ${entryIndex + 1}.`,
    imageUrl: `https://images.unsplash.com/photo-16${70000000000 + entryIndex}?auto=format&fit=crop&w=1200&q=80`,
    priceCents: (entryIndex + 1) * 137,
    tags: [`tag-${entryIndex % 5}`, `group-${entryIndex % 3}`],
    rating: (entryIndex % 10) + 1,
    dateStart: new Date(Date.UTC(2026, 2, (entryIndex % 26) + 1, 12, 0, 0)),
    dateEnd: new Date(Date.UTC(2026, 2, (entryIndex % 26) + 3, 12, 0, 0)),
  };
}

function buildEntriesForCoverage(collectionDoc, collectionIndex) {
  const docs = [];
  const combinationsCount = 2 ** OPTIONAL_ENTRY_FIELDS.length;

  for (let mask = 0; mask < combinationsCount; mask += 1) {
    const entryBase = buildEntryBase({
      collectionId: collectionDoc._id,
      collectionIndex,
      entryIndex: mask,
      variantLabel: `combo-${String(mask).padStart(2, '0')}`,
    });

    const optionalValues = buildOptionalEntryFields(mask);

    for (let bit = 0; bit < OPTIONAL_ENTRY_FIELDS.length; bit += 1) {
      const field = OPTIONAL_ENTRY_FIELDS[bit];
      const isEnabled = (mask & (1 << bit)) !== 0;
      if (isEnabled) {
        if (field === 'dateRange') {
          entryBase.dateStart = optionalValues.dateStart;
          entryBase.dateEnd = optionalValues.dateEnd;
        } else {
          entryBase[field] = optionalValues[field];
        }
      }
    }

    if (entryBase.status === 'completed') {
      entryBase.rating ??= optionalValues.rating;
      entryBase.dateStart ??= optionalValues.dateStart;

      if (mask % 2 === 0) {
        entryBase.dateEnd ??= optionalValues.dateEnd;
      }
    }

    docs.push(entryBase);
  }

  return docs;
}

function buildEntriesForPagination(collectionDoc, collectionIndex) {
  const docs = [];

  for (let i = 0; i < DEFAULT_ENTRIES_PER_COLLECTION; i += 1) {
    const entryBase = buildEntryBase({
      collectionId: collectionDoc._id,
      collectionIndex,
      entryIndex: i,
      variantLabel: 'paged',
    });

    const optionalValues = buildOptionalEntryFields(i + collectionIndex * 100);

    if (i % 2 === 0) {
      entryBase.description = optionalValues.description;
    }

    if (i % 3 === 0) {
      entryBase.imageUrl = optionalValues.imageUrl;
    }

    if (i % 4 === 0) {
      entryBase.priceCents = optionalValues.priceCents;
      entryBase.tags = optionalValues.tags;
    }

    if (i % 5 === 0) {
      entryBase.rating = optionalValues.rating;
      entryBase.dateStart = optionalValues.dateStart;
    }

    if (i % 6 === 0) {
      entryBase.dateStart = optionalValues.dateStart;
      entryBase.dateEnd = optionalValues.dateEnd;
    }

    if (entryBase.status === 'completed') {
      entryBase.rating ??= optionalValues.rating;
      entryBase.dateStart ??= optionalValues.dateStart;
    }

    docs.push(entryBase);
  }

  return docs;
}

function toCountMap(entryDocs) {
  const counts = new Map();

  for (const entry of entryDocs) {
    const key = entry.collectionId.toHexString();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function buildSeedPayload() {
  const collectionDocs = Array.from({ length: COLLECTIONS_COUNT }, (_, index) =>
    buildCollectionDoc(index),
  );

  const entryDocs = [];

  for (let index = 0; index < collectionDocs.length; index += 1) {
    const collectionDoc = collectionDocs[index];

    if (index === 0) {
      entryDocs.push(...buildEntriesForCoverage(collectionDoc, index));
      continue;
    }

    entryDocs.push(...buildEntriesForPagination(collectionDoc, index));
  }

  const entryCountByCollectionId = toCountMap(entryDocs);

  return {
    collectionDocs,
    entryDocs,
    entryCountByCollectionId,
  };
}

function normalizeMongoUri(rawValue) {
  if (!rawValue) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  let uri = rawValue.trim();

  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.slice('MONGODB_URI='.length).trim();
  }

  const isWrappedInDoubleQuotes = uri.startsWith('"') && uri.endsWith('"');
  const isWrappedInSingleQuotes = uri.startsWith("'") && uri.endsWith("'");

  if (isWrappedInDoubleQuotes || isWrappedInSingleQuotes) {
    uri = uri.slice(1, -1).trim();
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      'MONGODB_URI has invalid format. Expected mongodb:// or mongodb+srv:// connection string.',
    );
  }

  return uri;
}

async function run() {
  const dryRun = process.argv.includes('--dry-run');

  loadEnv({ path: '.env.local' });
  loadEnv();

  const uri = normalizeMongoUri(process.env.MONGODB_URI);

  const { collectionDocs, entryDocs, entryCountByCollectionId } = buildSeedPayload();

  if (dryRun) {
    console.info('Seed dry-run completed. No writes were made.');
    console.info(`Collections to insert: ${collectionDocs.length}`);
    console.info(`Entries to insert: ${entryDocs.length}`);
    console.info(
      `Entries in coverage collection: ${entryCountByCollectionId.get(collectionDocs[0]._id.toHexString()) ?? 0}`,
    );
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db();
    const collectionsCollection = db.collection('collections');
    const entriesCollection = db.collection('entries');

    await entriesCollection.deleteMany({ ownerId: OWNER_ID });
    await collectionsCollection.deleteMany({ ownerId: OWNER_ID });

    await collectionsCollection.insertMany(collectionDocs);
    await entriesCollection.insertMany(entryDocs);

    const bulkUpdates = collectionDocs.map((collectionDoc) => ({
      updateOne: {
        filter: { _id: collectionDoc._id },
        update: {
          $set: {
            entriesCount: entryCountByCollectionId.get(collectionDoc._id.toHexString()) ?? 0,
          },
        },
      },
    }));

    await collectionsCollection.bulkWrite(bulkUpdates);

    console.info('Seed completed successfully.');
    console.info(`Inserted collections: ${collectionDocs.length}`);
    console.info(`Inserted entries: ${entryDocs.length}`);
  } finally {
    await client.close();
  }
}

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
