import React, { useState, useEffect, useContext } from "react";
import axios from "../../network";
import classnames from "classnames";
import { SetHistoryStackContext } from "../Home";
import { useHistory } from "react-router-dom";

const SimiSingers: React.FC<SimiSingersProps> = (props) => {
  const { id, show } = props;
  const [simiSingers, setSimiSingers] = useState<ISimiSingerItem[]>([]);
  const classes = classnames("zsw-simi-singers", {
    show
  });
  const context = useContext(SetHistoryStackContext);
  const history = useHistory();

  useEffect(() => {
    setSimiSingers([]);
  }, [id]);

  useEffect(() => {
    function parseData(data: any[]) {
      const arr: ISimiSingerItem[] = [];

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        arr.push({
          id: item.id,
          name: item.name,
          picUrl: item.img1v1Url
        });
      }

      return arr;
    }

    async function fetchData() {
      const { data } = await axios.get("/simi/artist?id=" + id);
      console.log(parseData(data.artists));
      setSimiSingers(parseData(data.artists));
    }

    if (id && show) {
      fetchData();
    }
  }, [id, show]);

  function handleItemClick(id: string) {
    context.setHistoryStack("push", "singerDetail");
    history.push("/singerDetail/" + id);
  }

  return (
    <div className={classes}>
      {simiSingers.map((item) => {
        return (
          <div
            className="zsw-simi-singer-item"
            key={item.id}
            onClick={() => handleItemClick(item.id)}
          >
            <div>
              <img src={item.picUrl + "?param=120y120"} alt="" />
            </div>
            <p>{item.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(SimiSingers);
