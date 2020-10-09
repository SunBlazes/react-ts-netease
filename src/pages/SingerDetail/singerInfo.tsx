import React, { useEffect, useState } from "react";
import axios from "../../network";
import classnames from "classnames";

const SingerInfo: React.FC<SingerInfoProps> = (props) => {
  const { show, id } = props;
  const classes = classnames("zsw-singer-info", {
    show
  });

  const [desc, setDesc] = useState<ISingerDesc[]>([]);

  useEffect(() => {
    setDesc([]);
  }, [id]);

  useEffect(() => {
    function parseDesc(data: any) {
      const arr: ISingerDesc[] = [];
      arr.push({
        title: "简介",
        content: data.briefDesc
      });
      const introduction = data.introduction as any[];
      for (let i = 0; i < introduction.length; i++) {
        const item = introduction[i];
        arr.push({
          title: item.ti,
          content: item.txt
        });
      }

      return arr;
    }

    async function fetchData() {
      const { data } = await axios.get("/artist/desc?id=" + id);
      setDesc(parseDesc(data));
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className={classes}>
      {desc.map((item) => {
        return (
          <div className="zsw-singer-info-item" key={item.title}>
            <p className="title">{item.title}</p>
            {item.content.split("\n").map((item, index) => {
              return (
                <p className="content" key={item + index}>
                  {item}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(SingerInfo);
