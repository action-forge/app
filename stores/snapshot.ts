import { defineStore } from "pinia";

export const useSnapshot = defineStore("snapshot", () => {
  const snapshotId = ref<string | null>(null);
  const proposal = ref();
  const history = ref([]);
  const showAction = ref(false);

  const space = computed(() => proposal.value?.space || null);

  function getProposalResults(proposal: any) {
    const votes = [];

    for (let i = 0; i < proposal.choices.length; i++) {
      votes.push({
        choice: proposal.choices[i],
        votes: formatNumber(proposal.scores[i]),
        percentage: getPercentage(proposal.scores[i], proposal.scores_total),
      });
    }

    return votes;
  }

  async function fetchContent() {
    if (!snapshotId.value) return;
    try {
      const res = (await $fetch("https://hub.snapshot.org/graphql?", {
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
            id: snapshotId.value,
          },
        },
      })) as { data: { proposal: any } };
      if (!res.data.proposal) return (proposal.value = null);
      proposal.value = res.data.proposal;
      proposal.value.results = getProposalResults(proposal.value);
    } catch (error) {
      console.log("error fetching proposal", error);
    }
  }

  async function fetchSubContent(id: string){
     try {
       const res = (await $fetch("https://hub.snapshot.org/graphql?", {
         method: "post",
         body: {
           operationName: "Proposal",
           query: `query Proposal($id: String!) {
  proposal(id: $id) {
    id
    title
    choices
    start
    end
    state
    scores
    scores_total
    scores_state
    space {
      id
      name
      about
      symbol
      followersCount
      verified
      avatar
    }
  }
}
`,
           variables: { id },
         },
       })) as { data: { proposal: any } };
       if (!res.data.proposal) return  null
       const data = res.data.proposal;
       data.results = getProposalResults(data);
       return data;
     } catch (error) {
       console.log("error fetching proposal", error);
     }
  }

  async function fetchHistory() {
    if (wallet.connectedAddress === null) return (history.value = []);
    const res = await $fetch(
      "https://api.studio.thegraph.com/proxy/56272/action-forge-sepolia/v0.0.3",
      {
        method: "post",
        body: {
          query: `{actionForgeRegistereds(where: {
          createdBy: "${wallet.connectedAddress}"
        }) {
          id
          proposalId
          actionForgeId
          upkeepId
          createdBy
          proposal_snapshotId
          proposal_actionForgeId
          proposal_endTime
          proposal_action_types
          blockTimestamp
          proposal_winnerOption
        }}`,
        },
      },
    );

    const proposals = res.data.actionForgeRegistereds;
    const subContents = await Promise.all(proposals.map((p) => fetchSubContent(p.proposal_snapshotId)))
    const merged = proposals.map((p, i) => {
      const action_types = p.proposal_action_types.filter((a: string) => a !== '3');
      return { ...p, action_type: action_types[0], ...subContents[i] };
    })
    history.value = merged;
  }

  watch(snapshotId, fetchContent, { immediate: true });
  const wallet = useWalletStore();
  watch(() => wallet.connectedAddress, fetchHistory, { immediate: true });
  return { snapshotId, proposal, space, history, showAction };
});
