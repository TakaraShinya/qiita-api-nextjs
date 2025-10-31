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
  // モックデータ（開発・デモ用）
  const mockData: OrgQiitaItemsResponse[] = [
    {
      author: {
        profileImageUrl: "https://avatars.githubusercontent.com/u/1?v=4",
        urlName: "developer1",
      },
      likesCount: 342,
      linkUrl: "https://qiita.com/example1",
      ogpImageUrl: "https://picsum.photos/1200/630?random=1",
      tags: [
        { name: "React", urlName: "react" },
        { name: "TypeScript", urlName: "typescript" },
        { name: "Next.js", urlName: "nextjs" },
      ],
      title: "Next.js 14とApp Routerで作る最新のWebアプリケーション開発",
      uuid: "1",
    },
    {
      author: {
        profileImageUrl: "https://avatars.githubusercontent.com/u/2?v=4",
        urlName: "developer2",
      },
      likesCount: 287,
      linkUrl: "https://qiita.com/example2",
      ogpImageUrl: "https://picsum.photos/1200/630?random=2",
      tags: [
        { name: "Vue.js", urlName: "vuejs" },
        { name: "JavaScript", urlName: "javascript" },
      ],
      title: "Vue 3 Composition APIの実践的な使い方とベストプラクティス",
      uuid: "2",
    },
    {
      author: {
        profileImageUrl: "https://avatars.githubusercontent.com/u/3?v=4",
        urlName: "developer3",
      },
      likesCount: 245,
      linkUrl: "https://qiita.com/example3",
      ogpImageUrl: "https://picsum.photos/1200/630?random=3",
      tags: [
        { name: "Docker", urlName: "docker" },
        { name: "Kubernetes", urlName: "kubernetes" },
      ],
      title: "Kubernetesでマイクロサービスを本番運用するための完全ガイド",
      uuid: "3",
    },
    {
      author: {
        profileImageUrl: "https://avatars.githubusercontent.com/u/4?v=4",
        urlName: "developer4",
      },
      likesCount: 198,
      linkUrl: "https://qiita.com/example4",
      ogpImageUrl: "https://picsum.photos/1200/630?random=4",
      tags: [
        { name: "Python", urlName: "python" },
        { name: "機械学習", urlName: "machinelearning" },
      ],
      title: "Pythonで始める機械学習入門 - scikit-learnの基礎",
      uuid: "4",
    },
    {
      author: {
        profileImageUrl: "https://avatars.githubusercontent.com/u/5?v=4",
        urlName: "developer5",
      },
      likesCount: 156,
      linkUrl: "https://qiita.com/example5",
      ogpImageUrl: "https://picsum.photos/1200/630?random=5",
      tags: [
        { name: "AWS", urlName: "aws" },
        { name: "Terraform", urlName: "terraform" },
      ],
      title: "TerraformでAWSインフラをコード化する実践ガイド",
      uuid: "5",
    },
    {
      author: {
        profileImageUrl: "https://avatars.githubusercontent.com/u/6?v=4",
        urlName: "developer6",
      },
      likesCount: 134,
      linkUrl: "https://qiita.com/example6",
      ogpImageUrl: "https://picsum.photos/1200/630?random=6",
      tags: [
        { name: "Go", urlName: "go" },
        { name: "API", urlName: "api" },
      ],
      title: "GoでREST APIを作成する際のベストプラクティス",
      uuid: "6",
    },
  ];

  // 本番環境では実際のAPIからデータを取得
  try {
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
        orgQiitaItems: mockData,
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
  } catch (error) {
    // エラー時はモックデータを返す
    console.error("Failed to fetch Qiita data, using mock data:", error);
    return { orgQiitaItems: mockData };
  }
};

export default RankingContent;
