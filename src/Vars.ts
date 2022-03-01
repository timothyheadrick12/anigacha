import getPopularityOfRank from './requests/getPopularityOfRank'

export var top100Popularity: number

export const updateTop100Popularity = async () => {
  top100Popularity = await getPopularityOfRank(100)
}
