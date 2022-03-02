import getPopularityOfRank from './requests/getPopularityOfRank';

export const MAX_STAT = 1000000000000000;

export var popularityCut = {
  top: 0,
  top100: 0,
  top1000: 0,
  top2500: 0,
  top10000: 0,
};

export const calculateStat = (popularity: number): number => {
  if (popularity >= popularityCut.top) return MAX_STAT;
  return Math.pow(MAX_STAT / 100, popularity / popularityCut.top) * 100;
};

export const updatePopularity = async () => {
  popularityCut.top = await getPopularityOfRank(1);
  popularityCut.top100 = await getPopularityOfRank(100);
  popularityCut.top1000 = await getPopularityOfRank(1000);
  popularityCut.top2500 = await getPopularityOfRank(2500);
  popularityCut.top10000 = await getPopularityOfRank(10000);
};

export const calculateRarity = (favourites: number) => {
  if (favourites >= popularityCut.top100) return '★★★★★';
  else if (favourites >= popularityCut.top1000) return '★★★★';
  else if (favourites >= popularityCut.top2500) return '★★★';
  else if (favourites >= popularityCut.top10000) return '★★';
  else return '★';
};
