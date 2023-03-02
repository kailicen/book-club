// 1. Import `extendTheme`
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/raleway";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";
import { Input } from "./input";

// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
  colors: {
    brand: {
      100: "yellow.400",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
    heading: `'Raleway', sans-serif`,
  },
  styles: {
    global: () => ({
      body: {
        bg: "black",
        color: "yellow.50",
        lineHeight: "tall",
      },
      a: {
        color: "yellow.500",
      },
    }),
  },
  components: {
    Button,
    Input,
  },
});
