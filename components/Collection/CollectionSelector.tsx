"use client";

import { PaginationData, Perfume } from "@/types";
import PerfumeGrid from "./PerfumeGrid";
import { useState } from "react";
import MyCollection from "./MyCollection";

type Props = {
  perfumes: Perfume[];
  pagination: PaginationData;
};

const CollectionSelector = ({ perfumes, pagination }: Props) => {
  const [selected, setSelected] = useState("browse");

  return (
    <>
      <div className="tabs tabs-box tabs-accent w-fit">
        <input
          type="radio"
          name="CollectionTabs"
          className="tab"
          aria-label="Browse Database"
          defaultChecked
          onClick={() => setSelected("browse")}
        />
        <input
          type="radio"
          name="CollectionTabs"
          className="tab"
          aria-label="My Collection (0)"
          onClick={() => setSelected("collection")}
        />
      </div>

      {selected === "browse" && (
        <PerfumeGrid perfumes={perfumes} pagination={pagination} />
      )}

      {selected === "collection" && <MyCollection />}
    </>
  );
};

export default CollectionSelector;
