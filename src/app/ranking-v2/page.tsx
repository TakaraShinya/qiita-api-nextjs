import RankingContent from "./components/ranking-content";

const Page = async () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {await RankingContent()}
    </div>
  );
};

export default Page;
