import React, { useState } from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewslatterBox from "../components/NewslatterBox";
import Loading from "../components/Loading";

const Home = () => {
  const [heroLoading, setHeroLoading] = useState(false);
  const [latesoLoading, setLatesLoading] = useState(true);
  const [bestLoading, setBestLoading] = useState(false);

  // if (heroLoading || latesoLoading || bestLoading) return <Loading />;
  return (
    <div>
      <Hero setHeroLoading={setHeroLoading} />
      <LatestCollection setLatesLoading={setLatesLoading} />
      <BestSeller />
      {/* <OurPolicy /> */}
      {/* <NewslatterBox /> */}
    </div>
  );
};

export default Home;
