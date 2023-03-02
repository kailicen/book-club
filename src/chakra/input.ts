import { ComponentStyleConfig } from "@chakra-ui/theme";

export const Input: ComponentStyleConfig = {
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
    },
  },
  variants: {
    outline: {
      field: {
        bg: "gray.50",
        fontSize: "10pt",
        borderColor: "gray.100",
        _placeholder: { color: "gray.500" },
        _hover: {
          bg: "white",
          borderColor: "yellow.500",
        },
        _focus: {
          bg: "white",
          borderColor: "yellow.500",
        },
      },
    },
    filled: {
      field: {
        bg: "gray.800",
        border: "1px solid",
        borderColor: "gray.700",
        borderRadius: "full",
        height: "34px",
        fontSize: "10pt",
        _hover: {
          bgColor: "gray.700",
        },
        _focus: {
          boxShadow: "none",
          border: ".5px solid",
          borderColor: "yellow.500",
        },
      },
    },
  },
};
