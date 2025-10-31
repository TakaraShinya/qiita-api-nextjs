import { OrgQiitaItemsResponse } from "types";

import RankingCard from "./ranking-card";

interface PodiumRankingProps {
  first?: OrgQiitaItemsResponse;
  second?: OrgQiitaItemsResponse;
  third?: OrgQiitaItemsResponse;
}

const PodiumRanking = ({ first, second, third }: PodiumRankingProps) => {
  if (!first && !second && !third) return null;

  return (
    <div className="mb-16">
      {/* デスクトップ表示: 表彰台スタイル */}
      <div className="hidden items-end justify-center gap-4 lg:flex">
        {/* 2位 */}
        {second && (
          <div className="w-1/3 pb-8">
            <RankingCard item={second} rank={2} />
          </div>
        )}

        {/* 1位（中央・最大） */}
        {first && (
          <div className="w-1/3">
            <RankingCard item={first} rank={1} />
          </div>
        )}

        {/* 3位 */}
        {third && (
          <div className="w-1/3 pb-16">
            <RankingCard item={third} rank={3} />
          </div>
        )}
      </div>

      {/* モバイル表示: 縦並び */}
      <div className="flex flex-col gap-6 lg:hidden">
        {first && <RankingCard item={first} rank={1} />}
        {second && <RankingCard item={second} rank={2} />}
        {third && <RankingCard item={third} rank={3} />}
      </div>
    </div>
  );
};

export default PodiumRanking;
