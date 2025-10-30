"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { OrgQiitaItemsResponse } from "types";

interface RankingCardProps {
  item: OrgQiitaItemsResponse;
  rank: number;
}

const RankingCard = ({ item, rank }: RankingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // ランクに応じた背景色とメダル
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          badge: "bg-gradient-to-r from-yellow-400 to-yellow-600",
          border: "border-yellow-400",
          medal: "🥇",
        };
      case 2:
        return {
          badge: "bg-gradient-to-r from-gray-300 to-gray-500",
          border: "border-gray-400",
          medal: "🥈",
        };
      case 3:
        return {
          badge: "bg-gradient-to-r from-orange-400 to-orange-600",
          border: "border-orange-400",
          medal: "🥉",
        };
      default:
        return {
          badge: "bg-gradient-to-r from-blue-500 to-purple-600",
          border: "border-blue-400",
          medal: null,
        };
    }
  };

  const rankStyle = getRankStyle(rank);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border-2 ${
        rankStyle.border
      } bg-white/10 backdrop-blur-md transition-all duration-300 ${
        isHovered ? "scale-105 shadow-2xl" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ランクバッジ */}
      <div
        className={`absolute left-4 top-4 z-10 rounded-full px-4 py-2 ${rankStyle.badge} shadow-lg`}
      >
        <span className="text-2xl font-bold text-white">
          {rankStyle.medal ? rankStyle.medal : `#${rank}`}
        </span>
      </div>

      {/* いいね数 */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 shadow-lg">
        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
        <span className="text-lg font-bold text-white">{item.likesCount}</span>
      </div>

      {/* 記事画像 */}
      <Link href={item.linkUrl} target="_blank">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            alt={item.title}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={item.ogpImageUrl ?? item.author.profileImageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      </Link>

      {/* 記事情報 */}
      <div className="p-6">
        <Link href={item.linkUrl} target="_blank">
          <h3 className="mb-4 line-clamp-2 text-xl font-bold text-white transition-colors hover:text-yellow-400">
            {item.title}
          </h3>
        </Link>

        {/* 著者情報 */}
        <Link
          className="mb-4 flex items-center gap-3 hover:opacity-80"
          href={`https://qiita.com/${item.author.urlName}`}
          target="_blank"
        >
          <Image
            alt={item.author.urlName}
            className="rounded-full border-2 border-white"
            height={40}
            src={item.author.profileImageUrl}
            width={40}
          />
          <span className="text-sm font-medium text-gray-300">@{item.author.urlName}</span>
        </Link>

        {/* タグ */}
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Link
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/30"
              href={`https://qiita.com/tags/${tag.urlName}`}
              key={tag.name}
              target="_blank"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingCard;
