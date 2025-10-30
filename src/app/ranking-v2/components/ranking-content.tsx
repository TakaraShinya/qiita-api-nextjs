import cheerio from "cheerio";
import { JSDOM } from "jsdom";

import { OrgQiitaItemsResponse } from "types";

import PodiumRanking from "./podium-ranking";
import RankingGrid from "./ranking-grid";

const org_url: string = "https://qiita.com/organizations/ca-adv/items";

const RankingContent = async () => {
  const { orgQiitaItems } = await fetchQiita();

  if (!orgQiitaItems || orgQiitaItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl text-white">データがありません</div>
      </div>
    );
  }

  const sortedItems = orgQiitaItems.sort((a, b) => (a.likesCount > b.likesCount ? -1 : 1));
  const [first, second, third, ...rest] = sortedItems;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* タイトル */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-6xl font-bold text-transparent">
          Qiita LGTMランキング
        </h1>
        <p className="text-xl text-gray-300">CA Advancers Organization</p>
      </div>

      {/* 表彰台（1-3位） */}
      <PodiumRanking first={first} second={second} third={third} />

      {/* 4位以降のグリッド */}
      {rest.length > 0 && <RankingGrid items={rest} startRank={4} />}
    </div>
  );
};

const fetchQiita = async () => {
  const jsdom = new JSDOM();
  const response = await fetch(org_url);
  const htmlContent = await response.text();
  const $ = cheerio.load(htmlContent);

  let org_obj: string = "";
  $('script[data-component-name="OrganizationsItemsPage"]').each((i, element) => {
    org_obj = $(element).html() as string;
  });

  if (!org_obj) {
    return {
      orgQiitaItems: [],
    };
  }

  const parsedContent = JSON.parse(org_obj);
  const org_items = parsedContent.organization.paginatedOrganizationArticles
    .items as OrgQiitaItemsResponse[];

  // OGP画像を取得
  for (let i = 0; i < org_items.length; i++) {
    const { linkUrl } = org_items[i];
    const res = await fetch(linkUrl);
    const orgtext = await res.text();
    const ele = new jsdom.window.DOMParser().parseFromString(orgtext, "text/html");
    const headEls = ele.head.children;
    Array.from(headEls).map((v) => {
      const prop = v.getAttribute("property");
      if (!prop) return;
      if (prop === "og:image") {
        org_items[i].ogpImageUrl = v.getAttribute("content") ?? "";
      }
    });
  }

  return { orgQiitaItems: org_items };
};

export default RankingContent;
