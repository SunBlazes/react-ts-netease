type commentType = "music" | "playlist" | "mv";

interface CommentsProps {
  type: commentType;
  id: string;
  setMoreCommentsAttr: (attr: MoreCommentsAttrType) => void;
  changeShow: (type: showOfType) => void;
}
