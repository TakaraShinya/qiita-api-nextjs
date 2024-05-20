import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import ky from "ky";
import Image from "next/image";

import { ParsedQiitaItem, QiitaItemResponse } from "types";

import type { GetStaticProps, NextPage } from "next";

type HomeProps = {
  generatedAt: string;
  qiitaItems: ParsedQiitaItem[];
};

const Home: NextPage<HomeProps> = ({ qiitaItems, generatedAt }) => {
  return (
    <div className="mx-auto max-w-screen-md">
      <h1>📅 更新日時: {generatedAt}</h1>
      <div className="flex flex-wrap gap-y-12">
        {qiitaItems.map(({ id, likes_count, ogpImageUrl, url, title }, i) => {
          return (
            <div className={`w-full p-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pr-2" : "sm:pl-2"}`} key={id}>
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
              <h2 className="mt-2 h-8 w-24 rounded-lg bg-qiita text-center font-bold leading-8 text-white">
                {likes_count} LGTM
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const jsdom = new JSDOM();
  const apiUrl = `${process.env.QIITA_API_URL}?per_page=10`;
  const res = await ky.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });
  const qiitaItems = (await res.json()) as QiitaItemResponse[];
  const ogpUrls: string[] = [];
  for (let i = 0; i < qiitaItems.length; i++) {
    const { url } = qiitaItems[i];
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
  const parsedQiitaItems: ParsedQiitaItem[] = qiitaItems.map(
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
        user: {
          description: "",
          facebook_id: "",
          followees_count: 0,
          followers_count: 0,
          github_login_name: "",
          id: "",
          name: "",
          organization: "",
          profile_image_url: "",
        }, // Add the missing 'user' property
      };
      return parsedItem;
    },
  );
  const generatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

  return {
    props: { generatedAt, qiitaItems: parsedQiitaItems },
    revalidate: 60 * 10,
  };
};

export default Home;
