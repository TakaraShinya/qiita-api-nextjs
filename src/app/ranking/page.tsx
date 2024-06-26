import { Suspense } from "react";

import Loading from "./components/loading";
import QiitaItems from "./components/ui/qiita-items";

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <QiitaItems />
    </Suspense>
  );
};

export default Page;
