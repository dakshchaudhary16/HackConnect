export function parseRequiredSize(teamSizeStr) {
  if (!teamSizeStr) return 4
  const nums = String(teamSizeStr).match(/\d+/g)
  if (!nums || nums.length === 0) return 4
  return parseInt(nums[nums.length - 1], 10)
}