export const sleep = async (timeInMS: number) => {
  await new Promise<null>(res => {
    setTimeout(() => res(null), timeInMS)
  })
}
