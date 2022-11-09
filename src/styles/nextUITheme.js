import { createTheme } from "@nextui-org/react"

export const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      // brand colors
      primaryLight: '$blue200',
      primaryLightHover: '$blue300',
      primaryLightActive: '$blue400',
      primaryLightContrast: '$blue600',
      primary: '#4ADE7B',
      primaryBorder: '$blue500',
      primaryBorderHover: '$blue600',
      primarySolidHover: '$blue700',
      primarySolidContrast: '$white',
      primaryShadow: '$blue500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      myColor: '#ff4ecd'

    },
    space: {},
    fonts: {}
  }
})


export const darkTheme = createTheme({
    type: "dark",
    theme: {
        colors: {
            // brand colors
            primaryLight: '$blue200',
            primaryLightHover: '$blue300',
            primaryLightActive: '$blue400',
            primaryLightContrast: '$blue600',
            primary: '#4ADE7B',
            primaryBorder: '$blue500',
            primaryBorderHover: '$blue600',
            primarySolidHover: '$blue700',
            primarySolidContrast: '$white',
            primaryShadow: '$blue500',

            gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
            link: '#5E1DAD',

            myColor: '#ff4ecd'

        },
        space: {},
        fonts: {}
    }
})

