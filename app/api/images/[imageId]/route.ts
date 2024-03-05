import { getXataClient } from '@/utils/xata';
import { NextResponse } from 'next/server';

const xata = getXataClient();

// Next.js edge runtime
// https://nextjs.org/docs/pages/api-reference/edge
// export const runtime = 'edge';
// export const preferredRegion = 'iad1';

// A delete function to handle requests to delete an image
export async function DELETE(request: Request, { params }: { params: { imageId: string } }) {
  const { imageId } = params;
  if (!imageId) {
    return NextResponse.json(
      { message: 'imageId not found' },
      {
        status: 404
      }
    );
  }

  if (process.env.READ_ONLY === 'true') {
    return NextResponse.json(
      { message: 'Read only mode enabled' },
      {
        status: 403
      }
    );
  }

  // FInd all the tag links to this image
  const linksFromImage = await xata.db['tag-to-image']
    .filter({
      'image.id': imageId
    })
    .getAll();

  // Delete all tag links to this image first
  await xata.db['tag-to-image'].delete(linksFromImage.map((link) => link.id));
  // Delete the image
  await xata.db.image.delete(imageId);

  return NextResponse.json({ success: true });
}
