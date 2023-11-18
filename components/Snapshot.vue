<script lang="ts" setup>
import { parseMarkdown } from '@nuxtjs/mdc/dist/runtime'
import { formatNumber } from '@/composables/utils'

const snapshot = useSnapshot()

const content = ref()

async function parseContent () {
  if (!snapshot.proposal) return
  content.value = await parseMarkdown(snapshot.proposal.body)
}

const proposalLink = computed(() => {
  if (!snapshot.proposal) return '/'
  return `https://snapshot.org/#/${snapshot.space.id}/proposal/${snapshot.proposal.id}`
})

watch(() => snapshot.proposal, parseContent)
onMounted(parseContent)

function getAvatar (avatar: string) {
  return avatar.replace('ipfs://', 'https://ipfs.io/ipfs/')
}

function convert24HourTo12Hour (hours: number) {
  return convertToTwoDigit(hours > 12 ? hours - 12 : hours)
}

function convertToTwoDigit (number: number) {
  return number < 10 ? `0${number}` : number
}

function formatDate (date: number) {
  const d = new Date(date * 1000)
  // format date dd-mm-yyyy hh:mm AM/PM
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const am_pm = hours >= 12 ? 'PM' : 'AM'
  const formattedDate = `${day}-${month}-${year} ${convert24HourTo12Hour(hours)}:${convertToTwoDigit(minutes)} ${am_pm}`
  return formattedDate
}


</script>

<template>
  <div class="w-full border-x border-b border-blue-carolina bg-blue-alice rounded-xl">
    <!-- header -->
    <div v-if="snapshot.space" class="w-full flex items-center bg-green-honey rounded-xl gap-2 px-5 py-4">
      <!-- space -->
      <div class="min-w-fit flex items-center gap-2.5">
        <!-- logo -->
        <div class="flex items-center justify-content-center p-0.5 border border-blue-carolina rounded-full">
          <img class="w-5.5 h-5.5 rounded-full" :src="getAvatar(snapshot.space.avatar)" :alt="snapshot.space.name">
        </div>
        <div class="flex flex-col">
          <span class="flex items-center gap-1.5">
            <span class="font-medium uppercase leading-4">{{ snapshot.space.name }}</span>
            <IconVerified v-if="snapshot.space.verified" class="w-3.5 h-3.5 -mt-0.5 text-green-light" />
          </span>
          <span class="text-xs text-gray-main leading-2 -tracking-0.03 mt-1">
            {{ formatNumber(snapshot.space.followersCount) }} Members
          </span>
        </div>
      </div>
      <!-- title -->
      <div class="grow flex items-center justify-center gap-4 w-full whitespace-normal">
        <span class="w-full max-w-80% overflow-ellipsis">
          {{ snapshot.proposal.title }}
        </span>
      </div>
      <!-- socials -->
      <div class="flex items-center gap-2 ml-auto">
        <NuxtLink v-if="snapshot.space.website" :to="snapshot.space.website" title="website" target="_blank" :external="true">
          <IconWebsite class="w-3.5 h-3.5" />
        </NuxtLink>
        <NuxtLink v-if="snapshot.space.id" :to="`https://snapshot.org/#/${snapshot.space.id}`" title="snapshot" target="_blank" :external="true">
          <IconSnapshot class="w-3.5 h-3.5" />
        </NuxtLink>
        <NuxtLink v-if="snapshot.space.twitter" :to="`https://twitter.com/${snapshot.space.twitter}`" title="twitter" target="_blank" :external="true">
          <IconTwitter class="w-3.5 h-3.5" />
        </NuxtLink>
        <NuxtLink v-if="snapshot.space.github" :to="`https://github.com/${snapshot.space.github}`" title="github" target="_blank" :external="true">
          <IconGithub class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>

    <!-- body -->
    <div v-if="snapshot.proposal" class="w-full flex gap-18 px-5 py-4">
      <!-- right side -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center text-2.75 text-gray-just">
          <span
            class="text-2.5 px-2 pt-0.5 pb-0.25 text-white uppercase rounded-full"
            :class="[
              snapshot.proposal.state.toLowerCase() === 'closed' && 'bg-red',
              snapshot.proposal.state.toLowerCase() === 'active' && 'bg-green-6',
              snapshot.proposal.state.toLowerCase() === 'pending' && 'bg-gray-500',
            ]"
          >
            {{ snapshot.proposal.state }}
          </span>
          <div class="h-3 w-1 mx-2 border-r-2 border-blue-carolina" />
          Starts: <strong>{{ formatDate(snapshot.proposal.start) }}</strong> Ends: <strong>{{ formatDate(snapshot.proposal.end) }}</strong>
        </div>
        <div class="text-2.75 pt-2 text-gray-gravy">
          <ContentRendererMarkdown v-if="content" :value="content" class="max-h-30 overflow-y-scroll" />
        </div>
        <NuxtLink class="ml-auto text-xs font-medium" :to="proposalLink" target="_blank" :external="true">
          Read More
        </NuxtLink>
      </div>

      <!-- left side -->
      <div>
        <div class="flex flex-col border border-blue-carolina bg-green-honey rounded-md whitespace-nowrap">
          <!-- header -->
          <div class="flex items-center justify-center text-xs font-medium p-2 border-b border-blue-carolina rounded-t-md uppercase">
            {{ snapshot.proposal.state !== 'closed' ? 'Ongoing Results' : 'Results' }}
          </div>
          <!-- body -->
          <div class="flex flex-col p-3.5 min-w-60">
            <VoteOptions v-if="snapshot.proposal" :proposal="snapshot.proposal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
