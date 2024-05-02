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
      <h1>📅 更新日時: {generatedAt}</h1>
      <div className="flex flex-wrap gap-y-12">
        {myQiitaItems
          .sort((a, b) => (a.likes_count > b.likes_count ? -1 : 1))
          .map(({ id, likes_count, ogpImageUrl, url, title, tags, user, created_at }, i) => {
            return (
              <div
                className={`w-full p-0 sm:w-1/4 ${i % 4 === 0 ? "sm:pr-2" : "sm:pl-2"}`}
                key={id}
              >
                <a
                  className="block overflow-hidden rounded-lg border-2 border-gray-300 hover:opacity-50"
                  href={url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Image
                    alt={`${title}のQGP画像`}
                    height={630}
                    layout="responsive"
                    src={ogpImageUrl}
                    width={1200}
                  />
                </a>
                <div className="w-50 mt-2 h-24 rounded-lg bg-qiita text-center font-bold leading-8 text-white">
                  👍 {likes_count} LGTM <br />
                  <span>👨 {user.name}</span> <br />
                  <span>📅 {created_at}</span>
                </div>
              </div>
            );
          })}
      </div>
      <hr style={{ height: "10px", width: "100%" }}></hr>
      <h1>📅 更新日時: {generatedAt}</h1>
      <div className="flex flex-wrap gap-y-12">
        {orgQiitaItems
          .sort((a, b) => (a.likesCount > b.likesCount ? -1 : 1))
          .map(
            ({ uuid, likesCount, linkUrl, ogpImageUrl, title, tags, author, publishedAt }, i) => {
              return (
                <div
                  className={`w-full p-0 sm:w-1/4 ${i % 4 === 0 ? "sm:pr-2" : "sm:pl-2"}`}
                  key={uuid}
                >
                  <a
                    className="block overflow-hidden rounded-lg border-2 border-gray-300 hover:opacity-50"
                    href={linkUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt={`${title}のQGP画像`}
                      height={630}
                      layout="responsive"
                      src={ogpImageUrl ?? author.profileImageUrl}
                      width={1200}
                    />
                  </a>
                  <div className="w-50 mt-2 h-24 rounded-lg bg-qiita text-center font-bold leading-8 text-white">
                    👍 {likesCount} LGTM <br />
                    <span>👨 {author.name}</span> <br />
                    <span>📅 {publishedAt}</span>
                  </div>
                </div>
              );
            },
          )}
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
