// Generated by Xata Codegen 0.29.2. Please do not edit.
import type { BaseClientOptions, SchemaInference, XataRecord } from '@xata.io/client';
import { buildClient } from '@xata.io/client';

const tables = [
  {
    name: 'tag',
    columns: [{ name: 'name', type: 'string', notNull: true, defaultValue: 'gallery' }],
    revLinks: [{ column: 'tag', table: 'tag-to-image' }]
  },
  {
    name: 'tag-to-image',
    columns: [
      { name: 'image', type: 'link', link: { table: 'image' } },
      { name: 'tag', type: 'link', link: { table: 'tag' } }
    ]
  },
  {
    name: 'image',
    columns: [
      { name: 'name', type: 'string', notNull: true, defaultValue: 'Image' },
      { name: 'image', type: 'file', file: { defaultPublicAccess: true } }
    ],
    revLinks: [{ column: 'image', table: 'tag-to-image' }]
  }
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Tag = InferredTypes['tag'];
export type TagRecord = Tag & XataRecord;

export type TagToImage = InferredTypes['tag-to-image'];
export type TagToImageRecord = TagToImage & XataRecord;

export type Image = InferredTypes['image'];
export type ImageRecord = Image & XataRecord;

export type DatabaseSchema = {
  tag: TagRecord;
  'tag-to-image': TagToImageRecord;
  image: ImageRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: 'https://alchemy-o4v05e.us-west-2.xata.sh/db/colde-storage-plugin'
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};