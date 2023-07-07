import { z } from 'zod';
import { DefaultBlockSchema, defaultBlockSchema } from '@blocknote/core';
import { BlockNoteView, useBlockNote, createReactBlockSpec, ReactSlashMenuItem, defaultReactSlashMenuItems } from "@blocknote/react";

import "@blocknote/core/style.css";
import styles from "./App.module.css";

export const CustomExampleBlock = createReactBlockSpec({
  type: 'customExampleBlock',
  propSchema: z.object({
    simple: z.string(),
    custom: z.object({
      stringTest: z.string().optional(),
      numberTest: z.number().optional(),
    })
  }),
  props: {
    simple: 'This is a test',
    custom: {
      stringTest: 'This is a string test',
      numberTest: 123,
    }
  },
  render: ({ editor, block }) => {
    editor.updateBlock(block, {
      props: {
        simple: 'This is a test',
        custom: {
          stringTest: 'This is a string test',
        }
      }
    })

    return (
      <h2 className='mb-2'>Custom Example Block</h2>
    );
  },
  containsInlineContent: false,
});

// Creates a slash menu item for inserting an image block.
export const insertCustomExample = new ReactSlashMenuItem<
  DefaultBlockSchema & { customExampleBlock: typeof CustomExampleBlock }
>(
  'Insert Custom Example Block',
  (editor) => {
    editor.insertBlocks(
      [
        {
          type: 'customExampleBlock',
        },
      ],
      editor.getTextCursorPosition().block,
      'before'
    );
  },
  ['customExampleBlock'],
  'Custom',
  <>+</>,
  'This is a customExampleBlock.'
);

type WindowWithProseMirror = Window & typeof globalThis & { ProseMirror: any };

function App() {
  const editor = useBlockNote({
    blockSchema: {
      ...defaultBlockSchema,
      customExampleBlock: CustomExampleBlock,
    },
    slashCommands: [
      ...defaultReactSlashMenuItems,
      insertCustomExample,
    ],
    onEditorContentChange: (editor) => {
      console.log(editor.topLevelBlocks);
    },
    editorDOMAttributes: {
      class: styles.editor,
      "data-test": "editor",
    },
    theme: "light",
  });

  // Give tests a way to get prosemirror instance
  (window as WindowWithProseMirror).ProseMirror = editor?._tiptapEditor;

  return <BlockNoteView editor={editor} />;
}

export default App;
