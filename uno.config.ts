import { defineConfig } from 'unocss'

export default defineConfig({
  transformers: [],
  theme: {
    colors: {
      white: {
        nav: '#FBFDFF',
        DEFAULT: '#FFFFFF',
      },
      gray: {
        main: '#828282',
        just: '#7E8183',
        gravy: '#4B4D4E'
      },
      blue: {
        charcoal: '#2F4858',
        carolina: '#86BBD8',
        lapis: '#336699',
        alice: '#F3F8FB'
      },
      green: {
        light: "#9EE493",
        nayanza: '#DAF7DC',
        honey: "#E6F8EB"
      }
    }
  },
})
