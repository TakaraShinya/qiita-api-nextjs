import { Suspense } from "react";

import Loading from "./components/loading";
import RankingContent from "./components/ranking-content";

const Page = async () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Suspense fallback={<Loading />}>
        <RankingContent />
      </Suspense>
    </div>
  );
};

export default Page;
