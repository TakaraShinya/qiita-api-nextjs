"use client";

import { useReward } from "react-rewards";

interface Props {
  likesCount: number;
}

const LikesCountButton = ({ likesCount }: Props) => {
  const { reward } = useReward("rewardId", "confetti");

  return (
    <button
      // className="text-md inline-flex animate-bounce items-center rounded-lg bg-yellow-500 px-5 py-2.5 text-center font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-white"
      className="z-200 inline-flex animate-bounce rounded-lg border-b-4 border-blue-700 bg-blue-500 px-4 py-2 font-bold text-white hover:border-blue-500 hover:bg-blue-400 focus:ring-4 focus:ring-white"
      onClick={() => reward()}
      type="button"
    >
      <p className="pr-2 tracking-wider">いいね</p>
      <p>{likesCount}</p>
      {/* {`いいね ${likesCount}`} */}
      {/* {likesCount} */}
      <svg
        aria-hidden="true"
        className="ml-2 h-5 w-5"
        fill="currentColor"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z" />
      </svg>
      <span className="sr-only">Like Count</span>
      <span id="rewardId" />
    </button>
  );
};

export default LikesCountButton;
