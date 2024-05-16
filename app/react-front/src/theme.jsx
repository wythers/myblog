export const theme = {
  iconButton: {
    defaultProps: {
      variant: "text",
      size: "md",
      color: "gray",
      fullWidth: false,
      className: "w-[200px] focus:!outline-none",
    },
    valid: {
      variants: ["text"],
      sizes: ["sm", "md", "lg"],
      colors: [
        "gray",
      ],
    },
    styles: {
      base: {
        initial: {
          verticalAlign: "align-middle",
          userSelect: "select-none",
          fontFamily: "font-sans",
          fontWeight: "font-bold",
          textAlign: "text-center",
          textTransform: "uppercase",

          disabled: "disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none",
        },
        fullWidth: {
          display: "block",
          width: "w-full",
        },
      },
      sizes: {
        sm: {
          fontSize: "text-xs",

          borderRadius: "rounded-md",
        },
        md: {
          fontSize: "text-xs",

          borderRadius: "rounded-md",
        },
        lg: {
          fontSize: "text-sm",

          borderRadius: "rounded-md",
        },
      },
      variants: {
        text: {
          gray: {
            color: "text-gray-800 dark:text-white",
          },
        },
      },
    },
  },
  tooltip: {
    defaultProps: {
      interactive: false,
      placement: "bottom",
      offset: 5,
      dismiss: {},
      animate: {
        unmount: {},
        mount: {},
      },
      className: "bg-gray-200 text-gray-700",
    },
    styles: {
      base: {
        py: "py-1.5",
        px: "px-3",
        borderRadius: "rounded-lg",
        fontFamily: "font-sans",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        outline: "focus:outline-none",
        overflowWrap: "break-words",
        zIndex: "z-[999]",
        whiteSpace: "whitespace-normal",
      },
    },
  },
};