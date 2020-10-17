export default (noCopyRight: any, fee: number) => {
  if (noCopyRight) return false;
  switch (fee) {
    case 0:
    case 8:
      return true;
    case 1:
      return false;
    default: {
      console.log(fee);
      return false;
    }
  }
};
