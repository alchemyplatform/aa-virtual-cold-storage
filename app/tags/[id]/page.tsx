import { Images, TagWithImageCount } from '@/components/images';
import { IMAGE_SIZE, PAGE_SIZE } from '@/utils/constants';
import { getXataClient } from '@/utils/xata';
import { compact } from 'lodash';

const xata = getXataClient();

// get the total number of images for a tag
const getTagImageCount = async (id: string) => {
  const summarizeTag = await xata.db['tag-to-image']
    .filter({
      'tag.id': id
    })
    .summarize({
      columns: ['tag'],
      summaries: {
        totalCount: { count: '*' }
      }
    });

  return summarizeTag.summaries[0] ? summarizeTag.summaries[0].totalCount : 0;
};

export default async function Page({
  params: { id },
  searchParams
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const pageNumber = parseInt(searchParams.page) || 1;

  // get a paginated list of images matching this tag
  const recordsWithTag = await xata.db['tag-to-image']
    .filter({
      'tag.id': id
    })
    .select(['*', 'image.image'])
    .getPaginated({
      pagination: { size: PAGE_SIZE, offset: PAGE_SIZE * pageNumber - PAGE_SIZE }
    });

  // create a thumbnail for each image and apply it to the image object
  const imageRecords = compact(
    recordsWithTag.records.map((record) => {
      if (!record.image?.image) {
        return undefined;
      }
      const { url } = record.image?.image?.transform({
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        format: 'auto',
        fit: 'cover',
        gravity: 'top'
      });
      if (!url) {
        return undefined;
      }
      const thumb = {
        url,
        attributes: { width: IMAGE_SIZE, height: IMAGE_SIZE }
      };

      // this gets mapped back to the ImageRecord type on the client side
      return { ...record.image.toSerializable(), thumb };
    })
  );

  const tagImageCount = await getTagImageCount(id);

  const tag = await xata.db.tag.read(id);
  const tagWithCount = {
    ...tag?.toSerializable(),
    imageCount: tagImageCount
  } as TagWithImageCount;

  const totalNumberOfPages = Math.ceil(tagImageCount / PAGE_SIZE);

  const page = {
    pageNumber,
    hasNextPage: recordsWithTag.hasNextPage(),
    hasPreviousPage: pageNumber > 1,
    totalNumberOfPages: totalNumberOfPages
  };

  const readOnly = process.env.READ_ONLY === 'true';

  return <Images images={imageRecords} tags={[tagWithCount]} page={page} readOnly={readOnly} />;
}
