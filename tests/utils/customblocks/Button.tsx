import { z } from "zod";
import React from "react";
import { createBlockSpec, defaultProps, defaultPropSchema } from "@blocknote/core";
import { ReactSlashMenuItem } from "@blocknote/react";
import { RiRadioButtonFill } from "react-icons/ri";

export const Button = createBlockSpec({
  type: "button" as const,
  propSchema: z.object({
    backgroundColor: defaultPropSchema.shape.backgroundColor,
  }),
  props: {
    backgroundColor: defaultProps.backgroundColor,
  } as const,
  containsInlineContent: false,
  render: (block, editor) => {
    const button = document.createElement("button");
    button.innerText = "Insert Block Below";
    button.addEventListener("click", () => {
      editor.insertBlocks(
        [
          {
            type: "button",
            content: "Hello World",
          },
        ],
        editor.getBlock(block)!,
        "after"
      );
    });

    return {
      dom: button,
    };
  },
});

export const insertButton = new ReactSlashMenuItem<{
  button: typeof Button;
}>(
  "Insert Button",
  (editor) => {
    editor.insertBlocks(
      [
        {
          type: "button",
        },
      ],
      editor.getTextCursorPosition().block,
      "after"
    );
  },
  ["button", "click", "action"],
  "Media",
  <RiRadioButtonFill />,
  "Insert a button which inserts a block below it"
);
