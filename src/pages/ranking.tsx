import cheerio from "cheerio";
import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import ky from "ky";
import Image from "next/image";

import { ParsedQiitaItem, QiitaItemResponse, OrgQiitaItemsResponse } from "types";

import type { GetStaticProps, NextPage } from "next";

const org_url: string = "https://qiita.com/organizations/ca-adv/items";
type RankingProps = {
  generatedAt: string;
  myQiitaItems: ParsedQiitaItem[];
  orgQiitaItems: OrgQiitaItemsResponse[];
};

const Ranking: NextPage<RankingProps> = ({ generatedAt, myQiitaItems, orgQiitaItems }) => {
  return (
    <div className="mx-auto max-w-screen-2xl">
      {/* <Tabs tabs={['Tab1', 'Tab2', 'Tab3']} /> */}
      <div className="bg-[#800000] p-4 font-sans text-white">
        <div className="my-4 text-center text-4xl font-bold text-yellow-400">
          🏆 Qiita LGTMランキング 🏆
        </div>
        <div className="grid grid-cols-1 gap-4">
          {orgQiitaItems
            .sort((a, b) => (a.likesCount > b.likesCount ? -1 : 1))
            .map(
              ({ uuid, likesCount, linkUrl, ogpImageUrl, title, tags, author, publishedAt }, i) => {
                return (
                  <div className="flex items-center rounded bg-[#fec857] p-4 shadow-md" key={uuid}>
                    <div className="h-[50px] w-[50px] flex-none rounded-full bg-[#ffe564] text-center text-2xl font-extrabold leading-[50px] text-[#800000]">
                      {i + 1}
                    </div>
                    <img
                      alt={`avatar for ${title}`}
                      className="mx-2 h-[50px] w-[50px] flex-none rounded-full"
                      src={author.profileImageUrl}
                    />
                    <a
                      className="block overflow-hidden rounded-lg border-2 border-gray-300 hover:opacity-50"
                      href={linkUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="ml-4 flex-grow">
                        <Image
                          alt={`${title}のQGP画像`}
                          height={200}
                          layout="responsive"
                          src={ogpImageUrl ?? author.profileImageUrl}
                          width={400}
                        />
                      </div>
                    </a>
                    <div className="mt-2 h-10 w-40 rounded-lg bg-qiita text-center text-4xl font-bold leading-10 text-white">
                      👍 {likesCount}
                      <br />
                    </div>
                  </div>
                );
              },
            )}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<RankingProps> = async () => {
  const jsdom = new JSDOM();
  const apiUrl = `${process.env.QIITA_API_URL}?per_page=10`;
  const res = await ky.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });
  const myQiitaItems = (await res.json()) as QiitaItemResponse[];
  const ogpUrls: string[] = [];
  for (let i = 0; i < myQiitaItems.length; i++) {
    const { url } = myQiitaItems[i];
    const res = await ky.get(url);
    const text = await res.text();
    const el = new jsdom.window.DOMParser().parseFromString(text, "text/html");
    const headEls = el.head.children;
    Array.from(headEls).map((v) => {
      const prop = v.getAttribute("property");
      if (!prop) return;
      if (prop === "og:image") {
        ogpUrls.push(v.getAttribute("content") ?? "");
      }
    });
  }
  const parsedQiitaItems: ParsedQiitaItem[] = myQiitaItems.map(
    (
      {
        coediting,
        comments_count,
        created_at,
        id,
        likes_count,
        page_views_count,
        tags,
        title,
        updated_at,
        url,
        reactions_count,
        private: _private,
        user,
      },
      i,
    ) => {
      const parsedItem: ParsedQiitaItem = {
        coediting,
        comments_count,
        created_at,
        id,
        likes_count,
        ogpImageUrl: ogpUrls[i],
        page_views_count,
        private: _private,
        reactions_count,
        tags,
        title,
        updated_at,
        url,
        user,
      };
      return parsedItem;
    },
  );

  const generatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const response = await ky.get(org_url);
  const htmlContent = await response.text(); // Extract the HTML content from the KyResponse object
  const $ = cheerio.load(htmlContent); // Pass the HTML content to cheerio.load()

  let org_obj: string = "";
  $('script[data-component-name="OrganizationsItemsPage"]').each((i, element) => {
    org_obj = $(element).html() as string;
  });
  if (!org_obj) {
    return {
      notFound: true,
    };
  }
  const parsedContent = JSON.parse(org_obj);
  console.log(parsedContent.organization.paginatedOrganizationArticles.items);
  const org_items = parsedContent.organization.paginatedOrganizationArticles
    .items as OrgQiitaItemsResponse[];
  const orgOgpUrls: string[] = [];
  for (let i = 0; i < org_items.length; i++) {
    const { linkUrl } = org_items[i];
    const res = await ky.get(linkUrl);
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

  return {
    props: { generatedAt, myQiitaItems: parsedQiitaItems, orgQiitaItems: org_items }, // Use org_items in props object
    revalidate: 60 * 10,
  };
};

export default Ranking;
