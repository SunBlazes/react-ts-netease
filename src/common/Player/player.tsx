import React, { useEffect, useState, useRef } from "react";
import {
  PlayCircleFilled,
  StepBackwardFilled,
  StepForwardFilled,
  PauseCircleFilled,
  SoundFilled
} from "@ant-design/icons";
import Progress from "./progress";
import { connect } from "react-redux";
import { Slider, Tooltip } from "antd";
import { mapDispatchToProps, mapStateToProps } from "./mapToProps";
import WillPlayList from "./willPlayList";

const playModeArr: Array<IPlayMode> = [
  {
    playMode: "order",
    title: "顺序播放",
    icon: "icon-shouye-bofangmoshi-shunxubofang",
    index: 0
  },
  {
    playMode: "random",
    title: "随机播放",
    icon: "icon-shouye-bofangmoshi-suijibofang",
    index: 1
  },
  {
    playMode: "repeat",
    title: "单曲循环",
    icon: "icon-shouye-bofangmoshi-danquxunhuan",
    index: 2
  }
];

const Player: React.FC<PlayerProps> = (props) => {
  const {
    src,
    currIndex,
    playQueue,
    changePlayId,
    playUrlMap,
    fetchPlayUrl,
    changePlayState
  } = props;
  const [isplayed, setPlayed] = useState(false);
  const [value, setValue] = useState(0);
  const [volumn, setVolumn] = useState(1);
  const [max, setMax] = useState(0);
  const timerRef = useRef<any>();
  const [refresh, setRefresh] = useState(false);
  const [playMode, changePlayMode] = useState(0);
  // 播放队列是否显示
  const [willShow, setWillShow] = useState(false);

  function prev() {
    if (playQueue.length === 0) {
      return;
    }
    switch (playMode) {
      case 0:
        return handleOrderPlay(false);
      case 1:
        return handleRandomPlay();
      case 2:
        return handleRepeatPlay();
    }
  }

  function next() {
    if (playQueue.length === 0) {
      return;
    }
    switch (playMode) {
      case 0:
        return handleOrderPlay();
      case 1:
        return handleRandomPlay();
      case 2:
        return handleRepeatPlay();
    }
  }

  function handleRepeatPlay() {
    window.audio.currentTime = 0;
  }

  function handleRandomPlay() {
    const number = Math.floor(Math.random() * playQueue.length);
    if (!playUrlMap.get(playQueue[number])) {
      fetchPlayUrl(playQueue[number]);
    }
    changePlayId(number);
  }

  function handleOrderPlay(isNext = true) {
    if (isNext) {
      let index = currIndex + 1;
      if (index >= playQueue.length) {
        index = 0;
      }
      if (!playUrlMap.get(playQueue[index])) {
        fetchPlayUrl(playQueue[index]);
      }
      console.log(index);
      changePlayId(index);
    } else {
      let index = currIndex - 1;
      if (index < 0) {
        index = playQueue.length - 1;
      }
      if (!playUrlMap.get(playQueue[index])) {
        fetchPlayUrl(playQueue[index]);
      }
      changePlayId(index);
    }
  }

  function onChangePlayMode(index: number) {
    if (index + 1 > 2) {
      return changePlayMode(0);
    }
    changePlayMode(index + 1);
  }

  function onProgressChange(value: number) {
    window.audio.currentTime = value;
    setRefresh(!refresh);
    setPlayed(true);
  }

  function onChanging(value: number) {
    setValue(value);
    clearInterval(timerRef.current);
  }

  function onVolumnChanging(value: number) {
    console.log(value);
    window.audio.volume = value;
    setVolumn(value);
  }

  function handleCanPlay() {
    window.audio.play();
    setMax(window.audio.duration);
    setPlayed(true);
    changePlayState(true);
  }

  function changeWillListShow(flag: boolean) {
    setWillShow(flag);
  }

  function onPlayEnd() {
    next();
  }

  useEffect(() => {
    function handlePlaying() {
      setValue(window.audio.currentTime);
    }

    timerRef.current = setInterval(() => {
      handlePlaying();
      if (!isplayed) {
        clearInterval(timerRef.current);
      }
    });

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isplayed, refresh]);

  function onChangePlayState(flag: number) {
    if (!window.audio.src) return;
    if (flag) {
      window.audio.play();
      setPlayed(true);
      changePlayState(true);
    } else {
      window.audio.pause();
      setPlayed(false);
      changePlayState(false);
    }
  }

  useEffect(() => {
    window.audio = document.getElementById("play-audio") as HTMLAudioElement;
  }, []);

  return (
    <div className="zsw-player">
      <ul className="btn">
        <li>
          <StepBackwardFilled onClick={prev} />
        </li>
        <li>
          {window.audio && !window.audio.paused ? (
            <PauseCircleFilled onClick={() => onChangePlayState(0)} />
          ) : (
            <PlayCircleFilled onClick={() => onChangePlayState(1)} />
          )}
        </li>
        <li>
          <StepForwardFilled onClick={next} />
        </li>
      </ul>
      <Progress
        onChange={onProgressChange}
        max={max}
        value={value}
        onChanging={onChanging}
        className="player-progress"
      />
      <div className="volumn">
        <SoundFilled />
        <Slider
          max={1}
          step={0.1}
          className="volumn-slider"
          defaultValue={0}
          value={volumn}
          onChange={onVolumnChanging}
        />
      </div>
      <div className="play-mode">
        <Tooltip title={playModeArr[playMode].title}>
          <span
            className={`iconfont ${playModeArr[playMode].icon}`}
            onClick={() => onChangePlayMode(playModeArr[playMode].index)}
          ></span>
        </Tooltip>
      </div>
      <div className="will-play">
        <span
          className="iconfont icon-bofangliebiao"
          title="播放列表"
          onClick={() => changeWillListShow(!willShow)}
        ></span>
      </div>
      <audio
        src={src}
        id="play-audio"
        onCanPlay={handleCanPlay}
        onEnded={onPlayEnd}
      />
      <WillPlayList show={willShow} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
