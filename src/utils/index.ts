const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}
const getUnSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}
export { getSelectData, getUnSelectData }
