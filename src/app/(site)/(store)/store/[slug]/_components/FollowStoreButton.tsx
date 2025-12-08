import { CurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import FollowStoreClient from "./FollowStoreClient";

const FollowStoreButton = async ({ storeId }: { storeId: string }) => {
  const userId = await CurrentUserId();

  const isFollowing = userId
    ? await prisma.storeFollower.findFirst({
        where: {
          storeId,
          userId,
        },
        select: { id: true },
      })
    : null;

  // get follower count
  const followerCount = await prisma.storeFollower.count({
    where: { storeId },
  });

  if (userId) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { userId: true },
    });

    if (store?.userId === userId) return null; // owner shouldn't see follow button
  }

  return (
    <FollowStoreClient
      storeId={storeId}
      userId={userId}
      isFollowing={!!isFollowing}
      followerCount={followerCount}
    />
  );
};

export default FollowStoreButton;
