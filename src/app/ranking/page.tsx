import cheerio from "cheerio";
import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import Image from "next/image";
import Link from "next/link";

import { AnimatedTooltip } from "components/ui/animated-tooltip";
import { GlareCard } from "components/ui/glare-card";
import { ParsedQiitaItem, QiitaItemResponse, OrgQiitaItemsResponse } from "types";

import { ItemContainerScroll } from "./components/ui/item-container-scroll-animation";
import LikesCountButton from "./components/ui/likes-count-button";
import { TopContainerScroll } from "./components/ui/top-container-scroll-animation";

const org_url: string = "https://qiita.com/organizations/ca-adv/items";
type RankingProps = {
  generatedAt: string;
  myQiitaItems: ParsedQiitaItem[];
  orgQiitaItems: OrgQiitaItemsResponse[];
};

const Page = async () => {
  const { generatedAt, myQiitaItems, orgQiitaItems } = await fetchQiita();

  if (!orgQiitaItems || orgQiitaItems.length === 0) {
    return <div>データがありません</div>;
  }

  // TODO: fetchQiita側でソートさせる
  const sortedMyQiitaItems = orgQiitaItems.sort((a, b) => (a.likesCount > b.likesCount ? -1 : 1));
  const [firstItem, ...otherItems] = sortedMyQiitaItems;

  return (
    <div className="mx-auto max-w-screen-2xl">
      {/* <Tabs tabs={['Tab1', 'Tab2', 'Tab3']} /> */}
      <div className="bg-[#800000] p-4 font-sans text-white">
        <div className="my-4 text-center text-8xl font-bold text-yellow-400">
          🏆 Qiita LGTMランキング 🏆
        </div>
        <TopContainerScroll
          titleComponent={
            <div className="mt-12 flex">
              <p className="text-6xl font-bold">🏆 1位 🏆</p>
            </div>
          }
        >
          <div className="flex h-full flex-col items-center rounded-lg border border-gray-200 border-gray-700 bg-gray-800 bg-white  py-2 shadow">
            <div className="flex basis-3/4 items-center space-x-4">
              <GlareCard href={firstItem.linkUrl}>
                <Image
                  alt={`${firstItem.title}のQGP画像`}
                  className="h-full w-full rounded object-cover md:h-auto"
                  height={1200}
                  src={firstItem.ogpImageUrl ?? firstItem.author.profileImageUrl}
                  width={1200}
                />
              </GlareCard>
            </div>
            <div className="flex basis-1/4 items-center">
              <AnimatedTooltip
                image={firstItem.author.profileImageUrl}
                name={firstItem.author.urlName}
              />

              <div className="item-center flex flex-col space-y-1.5">
                <div className="ml-6 flex flex-row items-center justify-end">
                  <LikesCountButton likesCount={firstItem.likesCount} />
                </div>

                <div className="ml-6 flex flex-row items-center rounded border py-1 pl-2 pr-1">
                  <p className="py-2 pr-2 text-lg">タグ</p>
                  {firstItem.tags.map((tag) => (
                    <Link
                      className="me-2 rounded-xl bg-gray-600 px-2 py-1 font-medium tracking-widest text-gray-300 duration-150 ease-in hover:bg-gray-500 hover:text-white"
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
          </div>
        </TopContainerScroll>
        <div className="grid grid-cols-2 gap-4">
          {otherItems.map(
            ({ uuid, likesCount, linkUrl, ogpImageUrl, title, tags, author, publishedAt }, i) => {
              return (
                <ItemContainerScroll
                  key={uuid}
                  titleComponent={
                    <div className="mt-12 flex">
                      <p className="text-6xl font-bold">🏆 {i + 2}位 🏆</p>
                    </div>
                  }
                >
                  <div className="flex items-center rounded bg-[#fec857] p-4 shadow-md" key={uuid}>
                    <div className="h-full w-[50px] flex-none rounded-full bg-[#ffe564] text-center text-2xl font-extrabold leading-[50px] text-[#800000]">
                      {i + 1}
                    </div>
                    <Image
                      alt={`avatar for ${title}`}
                      className="mx-2 h-[50px] w-[50px] flex-none rounded-full"
                      height={50}
                      src={author.profileImageUrl}
                      width={50}
                    />
                    <Link
                      className="block overflow-hidden rounded-lg border-2 border-gray-300 hover:opacity-50"
                      href={linkUrl}
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
                    </Link>
                    <div className="mt-2 h-10 w-40 rounded-lg bg-qiita text-center text-4xl font-bold leading-10 text-white">
                      👍 {likesCount}
                      <br />
                    </div>
                  </div>
                </ItemContainerScroll>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

const fetchQiita = async () => {
  const jsdom = new JSDOM();
  const apiUrl = `${process.env.QIITA_API_URL}?per_page=10`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
    next: { revalidate: 60 * 10 },
  });
  const myQiitaItems = (await res.json()) as QiitaItemResponse[];
  const ogpUrls: string[] = [];
  for (let i = 0; i < myQiitaItems.length; i++) {
    const { url } = myQiitaItems[i];
    const res = await fetch(url);
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
  const response = await fetch(org_url);
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
  const org_items = parsedContent.organization.paginatedOrganizationArticles
    .items as OrgQiitaItemsResponse[];
  const orgOgpUrls: string[] = [];
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

  return { generatedAt, myQiitaItems: parsedQiitaItems, orgQiitaItems: org_items };
};

export default Page;
