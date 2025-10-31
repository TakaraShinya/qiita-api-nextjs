import { OrgQiitaItemsResponse } from "types";

import RankingCard from "./ranking-card";

interface RankingGridProps {
  items: OrgQiitaItemsResponse[];
  startRank: number;
}

const RankingGrid = ({ items, startRank }: RankingGridProps) => {
  return (
    <div>
      <h2 className="mb-8 text-center text-3xl font-bold text-white">その他のランキング</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <RankingCard item={item} key={item.uuid} rank={startRank + index} />
        ))}
      </div>
    </div>
  );
};

export default RankingGrid;
