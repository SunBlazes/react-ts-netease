export default function (time: number) {
  const totalSeconds = parseInt("" + time / 1000);
  const minute = parseInt(`${totalSeconds / 60}`);
  const seconds = parseInt(`${totalSeconds - minute * 60}`);
  return (
    minute.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
}
