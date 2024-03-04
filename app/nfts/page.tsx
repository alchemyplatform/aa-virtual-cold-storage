import { Images, TagWithImageCount } from '@/components/images';
import { useAccountContext } from '@/context/account';
import useNftsForOwner from '@/hooks/assets.ts/useNftsForOwner';
import { IMAGE_SIZE } from '@/utils/constants';
import { compact, pick } from 'lodash';

export default async function Page({ searchParams }: { searchParams: { page: string } }) {
  const pageNumber = parseInt(searchParams.page) || 1;

  const { client } = useAccountContext();

  // TODO replace with react-query infinite query for pagination

  const { items, count } = useNftsForOwner({ address: client.account });

  // This page object is needed for building the buttons in the pagination component
  const page = {
    pageNumber,
    hasNextPage: imagesPage.hasNextPage(),
    hasPreviousPage: pageNumber > 1,
    totalNumberOfPages
  };

  // transform helper to create a thumbnail for each image and apply it to the image object
  console.time('Fetching images transforms');
  const images = compact(
    await Promise.all(
      imagesPage.records.map(async (record) => {
        if (!record.image) {
          return undefined;
        }

        const { url } = record.image.transform({
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          format: 'auto',
          fit: 'cover',
          gravity: 'top'
        });

        // Since the resulting image will be a square, we don't really need to fetch the metadata in this case.
        // The meta data provides both the original and transformed dimensions of the image.
        // The metadataUrl you get from the transform() call.
        // const metadata = await fetchMetadata(metadataUrl);

        if (!url) {
          return undefined;
        }

        const thumb = {
          url,
          attributes: {
            width: IMAGE_SIZE, // Post transform width
            height: IMAGE_SIZE // Post transform height
          }
        };

        return { ...record.toSerializable(), thumb };
      })
    )
  );
  console.timeEnd('Fetching images transforms');

  // Find the top 10 tags
  const tags = topTags.summaries.map((tagSummary) => {
    const tag = tagSummary.tag;
    const serializableTag = pick(tag, ['id', 'name', 'slug']);
    return {
      ...serializableTag,
      imageCount: tagSummary.imageCount
    };
  }) as TagWithImageCount[];

  const readOnly = process.env.READ_ONLY === 'true';

  return <Images images={images} tags={tags} page={page} readOnly={readOnly} />;
}
