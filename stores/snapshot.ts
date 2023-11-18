import { defineStore } from 'pinia'

export const useSnapshot = defineStore('snapshot', () => {
  const snapshotId = ref<string | null>(null)
  const proposal = ref()

  const space = computed(() => proposal.value?.space || null)

  function getProposalResults(proposal: any){
    const votes = []

    for (let i = 0; i < proposal.choices.length; i++) {
      votes.push({
        choice: proposal.choices[i],
        votes: formatNumber(proposal.scores[i]),
        percentage: getPercentage(proposal.scores[i], proposal.scores_total),
      })
    }

    return votes
  }

  async function fetchContent() {
    if (!snapshotId.value) return

    const res = await $fetch('https://hub.snapshot.org/graphql?', {
      method: "post",
      body: {
        operationName: "Proposal",
        query: `query Proposal($id: String!) {
  proposal(id: $id) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    scores
    scores_total
    scores_state
    space {
      id
      name
      about
      symbol
      github
      followersCount
      verified
      twitter
      avatar
      website
    }
  }
}
`,
        variables: {
          id: snapshotId.value
        },
      }
    }) as { data: { proposal: any } }
    if (!res.data.proposal) return proposal.value = null
    proposal.value = res.data.proposal
    proposal.value.results = getProposalResults(proposal.value)
  }


  watch(snapshotId, fetchContent, { immediate: true })
  return { snapshotId, proposal, space }
})
