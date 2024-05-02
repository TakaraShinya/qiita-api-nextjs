import { useState } from "react";

type TabProps = {
  tabs: string[];
};

const Tabs = ({ tabs }: TabProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          //   css={css`
          //     background-color: ${tab === activeTab ? 'blue' : 'white'};
          //     color: ${tab === activeTab ? 'white' : 'black'};
          //   `}
        >
          {tab}
        </button>
      ))}
      <div>{activeTab} content</div>
    </div>
  );
};

export default Tabs;
