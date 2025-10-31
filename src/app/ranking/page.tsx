import QiitaItems from "./components/ui/qiita-items";

const Page = async () => {
  return <>{await QiitaItems()}</>;
};

export default Page;
