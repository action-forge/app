<script setup lang="ts">
import { scale, unScale } from '@hubble-exchange/utils'
import { useMagicKeys, watchDebounced } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// INFO: don't pass 0 in debounce, it will cause errors in case of using it as number input
const prop = defineProps({
  placeholder: { default: '0', type: [String, Number] },
  type: { default: 'number', type: String },
  value: { default: '', type: [String, Number] },
  min: { default: 0, type: Number },
  max: { default: 0, type: Number },
  step: { default: '0.01', type: String },
  decimals: { default: 18, type: Number },
  debounce: { default: 700, type: Number },
  disabled: { default: false, type: Boolean },
  readonly: { default: false, type: Boolean },
  continuesCallbacks: { default: false, type: Boolean }
})
const emit = defineEmits<{ (e: 'change', value: string): void }>()

const inputElId = computed(() => (Math.random().toString(36) + Date.now().toString(36)).substr(2))
const inpElement = ref<HTMLInputElement | null>(null)
const input = ref(`${prop.value}` || '')
let wasValueChanged = false

const amountRegex = computed(() => prop.disabled ? /^$/ : new RegExp(`^-?\\d*(${prop.decimals === 0 ? '' : '\\.'}\\d{0,${prop.decimals}})?$`)) // validate decimals count or no decimals at all
const isInpNumber = computed(() => prop.type === 'number')
const isValidNumber = computed(() => input.value !== '' && amountRegex.value.test(input.value))
function validateInputAmount (value: string) {
  const isNumberValid = amountRegex.value.test(value)

  // Convert the value to a float for comparison.
  const numberValue = Number.parseFloat(value)
  if (!Number.isNaN(numberValue)) {
    // Check if the number is within the min and max range. If min or max is 0, it's considered as no limit.
    const isAboveMin = prop.min !== 0 ? numberValue >= prop.min : true
    const isBelowMax = prop.max !== 0 ? numberValue <= prop.max : true

    return isNumberValid && isAboveMin && isBelowMax
  }
  return isNumberValid
}

function onChange () {
  // prevent infinite event loop
  if (wasValueChanged || input.value === prop.value) {
    wasValueChanged = false
    return
  }
  emit('change', input.value)
}

watchDebounced(input, onChange, { debounce: prop.debounce })
watch(
  () => prop.value,
  () => {
    if (input.value !== prop.value) {
      input.value = `${prop.value}`
      if (!prop.continuesCallbacks)
        wasValueChanged = true
    }
  }
)

// Restricts input for the given textbox to the given inputFilter function.
const InputFilters = function (textbox: Element, inputFilter: (value: string) => boolean, isAdd = true): void {
  const callback = function (
    this: (HTMLInputElement | HTMLTextAreaElement) & {
      oldValue: string
      oldSelectionStart: number | null
      oldSelectionEnd: number | null
    }
  ) {
    if (inputFilter(this.value)) {
      this.oldValue = this.value
      this.oldSelectionStart = this.selectionStart
      this.oldSelectionEnd = this.selectionEnd
    }
    else if (Object.prototype.hasOwnProperty.call(this, 'oldValue')) {
      this.value = this.oldValue
      input.value = this.oldValue
      if (this.oldSelectionStart !== null && this.oldSelectionEnd !== null)
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
    }
    else {
      this.value = ''
    }
  }
  const events = ['input', 'keydown', 'keyup', 'focusout']
  if (isAdd) {
    events.forEach((event) => {
      textbox.addEventListener(event, callback)
    })
  }
  else {
    events.forEach((event) => {
      textbox.removeEventListener(event, callback)
    })
  }
}

onMounted(() => {
  if (inpElement.value === null)
    return

  // Install input filters.
  if (isInpNumber.value)
    InputFilters(inpElement.value, validateInputAmount) // 'Must be a floating (real) number'
  // InputFilters(inputEL, (value) => /^-?\d*$/.test(value)) // 'Must be an integer'
  // InputFilters(inputEL, (value) => /^\d*$/.test(value)) // 'Must be an unsigned integer'
  // InputFilters(inputEL, (value) => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 500)) // 'Must be between 0 and 500'
  // InputFilters(inputEL, (value) => /^-?\d*[.,]?\d{0,2}$/.test(value)) // 'Must be a currency value'
  // InputFilters(inputEL, (value) => /^[a-z]*$/i.test(value)) //  'Must use alphabetic latin characters'
  // InputFilters(inputEL, (value) => /^[0-9a-f]*$/i.test(value)) // 'Must use hexadecimal characters'

  const keys = useMagicKeys({ target: inpElement.value })
  const shiftArrowUp = keys['Shift+ArrowUp']
  const shiftArrowDown = keys['Shift+ArrowDown']
  const shiftCmd = keys['Shift+cmd']
  const shiftCtrl = keys['Shift+Ctrl']
  const arrowUp = keys.ArrowUp
  const arrowDown = keys.ArrowDown
  const steps = computed((): string => {
    if ((shiftCmd.value || shiftCtrl.value) && (arrowUp.value || arrowDown.value))
      return '10'
    if ((shiftArrowUp.value || shiftArrowDown.value || prop.decimals === 0) && Number(prop.step) < 1)
      return '1'
    return prop.step
  })

  watch(arrowUp, () => {
    if (!arrowUp.value || inpElement.value === null || !isInpNumber.value)
      return
    let inpAmount = '0'
    if (isValidNumber.value)
      inpAmount = inpElement.value.value
    const amount = scale(inpAmount, prop.decimals).add(scale(steps.value, prop.decimals))
    if (amount.gt(0))
      input.value = unScale(amount, prop.decimals).toString()
  })

  watch(arrowDown, () => {
    if (!arrowDown.value || inpElement.value === null || !isValidNumber.value || !isInpNumber.value)
      return
    const inpAmount = inpElement.value.value
    const amount = scale(inpAmount, prop.decimals).sub(scale(steps.value, prop.decimals))
    if (amount.gt(0))
      input.value = unScale(amount, prop.decimals).toString()
    if (amount.eq(0))
      input.value = ''
  })
})

onBeforeUnmount(() => {
  // Install input filters.
  if (isInpNumber.value && inpElement.value)
    InputFilters(inpElement.value, validateInputAmount, false) // remove listener
})
</script>

<template>
  <input
    :id="inputElId"
    ref="inpElement"
    v-model="input"
    :placeholder="`${placeholder}`"
    :disabled="readonly"
    class="unstyled-input w-full h-full text-base"
  >
</template>

<style>
/* stylelint-disable selector-no-vendor-prefix */
/* stylelint-disable property-no-vendor-prefix */

.hb .unstyled-input {
  --placeholder-color: #383866;
}

.unstyled-input {
  --placeholder-color: #595959;
}

.dark .unstyled-input {
  --placeholder-color: #777E90;
}

/* remove default style input */
.unstyled-input,
.unstyled-input:focus,
.unstyled-input:active,
.unstyled-input[type="number"] {
  border: none;
  border-width: 0;
  outline-offset: 0;
  outline-color: transparent;
  outline-style: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Chrome, Safari, Edge, Opera */
.unstyled-input::-webkit-outer-spin-button,
.unstyled-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.unstyled-input::-webkit-input-placeholder {
  color: var(--placeholder-color);
  transition: all 0.2s;
}

.unstyled-input::-moz-placeholder {
  color: var(--placeholder-color);
  transition: all 0.2s;
}

.unstyled-input:-ms-input-placeholder {
  color: var(--placeholder-color);
  transition: all 0.2s;
}

.unstyled-input:-moz-placeholder {
  color: var(--placeholder-color);
  transition: all 0.2s;
}

.unstyled-input:focus::-webkit-input-placeholder {
  padding-left: 0.25em;
}

.unstyled-input:focus::-moz-placeholder {
  padding-left: 0.25em;
}

.unstyled-input:focus:-ms-input-placeholder {
  padding-left: 0.25em;
}

.unstyled-input:focus:-moz-placeholder {
  padding-left: 0.25em;
}
</style>
