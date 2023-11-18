import type { Chain } from '@web3-onboard/common/dist/types'
import type { OnboardAPI } from '@web3-onboard/core/dist'

const iconSVG = `  <svg
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="512" height="512" rx="256" fill="black" />
    <rect
      x="249.629"
      y="434.531"
      width="360.399"
      height="15.8202"
      rx="7.91011"
      transform="rotate(-90.2447 249.629 434.531)"
      fill="white"
      fill-opacity="0.5"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M254.84 87.701L424.593 257.454L257.454 424.593L87.7009 254.84L254.84 87.701ZM243.696 62.0673C244.188 61.3031 244.769 60.5793 245.438 59.9102C250.516 54.8322 258.749 54.8322 263.827 59.9102L451.765 247.848C454.343 250.426 455.613 253.818 455.573 257.198C455.749 260.739 454.485 264.339 451.78 267.044L267.044 451.78C262.304 456.521 254.814 456.836 249.708 452.725C248.519 452.12 247.404 451.321 246.41 450.327L62.449 266.366C61.5097 265.816 60.6247 265.138 59.8191 264.333C54.7411 259.255 54.7411 251.022 59.8191 245.944L243.696 62.0673Z"
      fill="white"
    />
    <rect
      x="73.3484"
      y="250.247"
      width="83.4157"
      height="15.8202"
      rx="7.91011"
      fill="white"
      fill-opacity="0.5"
    />
    <rect
      x="355.955"
      y="250.247"
      width="83.4157"
      height="15.8202"
      rx="7.91011"
      fill="white"
      fill-opacity="0.5"
    />
    <rect
      x="275.416"
      y="362.201"
      width="100.711"
      height="15.8202"
      rx="7.91011"
      transform="rotate(-46.5568 275.416 362.201)"
      fill="white"
      fill-opacity="0.5"
    />
    <circle cx="345.169" cy="298.427" r="15.1011" fill="white" />
    <rect
      x="169.739"
      y="287.656"
      width="100.711"
      height="15.8202"
      rx="7.91011"
      transform="rotate(45.3255 169.739 287.656)"
      fill="white"
      fill-opacity="0.5"
    />
    <circle cx="168.27" cy="298.427" r="15.1011" fill="white" />
    <rect
      x="158.921"
      y="212.628"
      width="100.711"
      height="15.8202"
      rx="7.91011"
      transform="rotate(-46.5568 158.921 212.628)"
      fill="white"
      fill-opacity="0.5"
    />
    <circle cx="168.27" cy="213.573" r="15.1011" fill="white" />
    <rect
      x="285.227"
      y="139.506"
      width="100.711"
      height="15.8202"
      rx="7.91011"
      transform="rotate(45.3255 285.227 139.506)"
      fill="white"
      fill-opacity="0.5"
    />
    <circle cx="345.169" cy="213.573" r="15.1011" fill="white" />
    <path
      d="M190.192 259.603C188.438 256.958 188.434 253.521 190.183 250.872L249.801 160.592C252.92 155.868 259.849 155.855 262.986 160.568L322.907 250.585C324.682 253.252 324.674 256.725 322.886 259.383L262.61 349.004C259.463 353.683 252.571 353.66 249.454 348.961L190.192 259.603Z"
      fill="white"
    />
    <rect
      x="254.946"
      y="208.57"
      width="68.1971"
      height="66.0468"
      transform="rotate(43.6076 254.946 208.57)"
      fill="black"
    />
    <circle cx="78.382" cy="258.157" r="30.9213" fill="white" />
    <circle cx="78.3821" cy="258.157" r="11.5056" fill="black" />
    <circle cx="256" cy="431.461" r="30.9213" fill="white" />
    <circle cx="256" cy="431.461" r="11.5056" fill="black" />
    <circle cx="256" cy="80.5393" r="30.9213" fill="white" />
    <circle
      cx="256"
      cy="80.5394"
      r="11.5056"
      fill="black"
      fill-opacity="0.98"
    />
    <circle cx="434.337" cy="258.157" r="30.9213" fill="white" />
    <circle cx="434.337" cy="258.157" r="11.5056" fill="black" />
  </svg>`

export async function overrideWalletStyles(theme?: number): Promise<void> {
  if (window !== undefined) {
    const styleId = 'custom'
    const modeId = 'mode'
    const onboardEl = window.document.getElementsByTagName('onboard-v2')[0]

    if (!onboardEl)
      return
    if (onboardEl.shadowRoot === null)
      return

    const moodCSS = ((await $fetch(`/css/wallet/light.css`)) as string) // load style

    // remove existing mode styles
    onboardEl.shadowRoot.getElementById(modeId)?.remove()
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('id', modeId)
    style.textContent = moodCSS
    onboardEl.shadowRoot.append(style)

    // inject is custom style don't exists
    if (!onboardEl.shadowRoot.getElementById(styleId)) {
      const customCSS = (await $fetch('/css/wallet/custom.css')) as string // load style
      const style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.setAttribute('id', styleId)
      style.textContent = customCSS
      onboardEl.shadowRoot.append(style)
    }
    if (!onboardEl.shadowRoot.getElementById('font')) {
      const fontCSS = (await $fetch('/css/fonts.css')) as string // load style
      const style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.setAttribute('id', 'font')
      style.textContent = fontCSS
      onboardEl.shadowRoot.append(style)
    }
  }
}

export async function getOnboard(chains: Chain[]): Promise<OnboardAPI> {
  const Onboard = (await import('@web3-onboard/core')).default

  const injectedModule = (await import('@web3-onboard/injected-wallets')).default
  const injected = injectedModule({ filter: {} /* mapping of wallet label to filter here */, custom: [] })

  const onboard = Onboard({
    wallets: [injected],
    chains,
    appMetadata: {
      name: 'Action Forge',
      icon: iconSVG, // svg string icon
      description: 'Action Forge Post Proposal Action',
      recommendedInjectedWallets: [{ name: 'MetaMask', url: 'https://metamask.io' }],
      explore: 'https://forgeaction.xyz',
    },
    connect: { autoConnectLastWallet: true, disableUDResolution: true },
    accountCenter: { desktop: { enabled: false }, mobile: { enabled: false } },
  })

  return onboard
}
