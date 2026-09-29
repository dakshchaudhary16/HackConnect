export function computeMatchScore(userSkills = [], candidateSkills = [], allSkills = []) {
  if (allSkills.length === 0) return 0

  const userSet = new Set(userSkills)
  const overlap = candidateSkills.filter((s) => userSet.has(s))
  const complement = candidateSkills.filter((s) => !userSet.has(s))
  const union = new Set([...userSkills, ...candidateSkills])

  const coverageRatio = complement.length / allSkills.length
  const similarityRatio = union.size ? overlap.length / union.size : 0

  const weighted = coverageRatio * 0.7 + similarityRatio * 0.3
  return Math.min(100, Math.round(weighted * 100))
}