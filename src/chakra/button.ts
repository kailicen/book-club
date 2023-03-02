import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "60px",
    fontSize: "10pt",
    fontWeight: 600,
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
    },
  },
  variants: {
    solid: {
      color: "white",
      bg: "yellow.500",
      _hover: {
        bg: "yellow.400",
      },
    },
    outline: {
      color: "yellow.400",
      border: "1px solid",
      borderColor: "gray.700",
      _hover: {
        bg: "gray.900",
        borderColor: "rgba(254, 249, 195,.3)",
      },
    },
    oauth: {
      color: "black",
      height: "34px",
      border: "1px solid",
      borderColor: "gray.300",
      _hover: {
        bg: "gray.50",
      },
    },
    ghost: {
      borderRadius: "full",
      height: "28px",
      _hover: {
        bg: "gray.800",
      },
    },
  },
};
