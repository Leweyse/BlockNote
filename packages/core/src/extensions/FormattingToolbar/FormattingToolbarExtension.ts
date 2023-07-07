import { Extension } from "@tiptap/core";
import { PluginKey } from "prosemirror-state";
import { BlockNoteEditor, BlockSchema } from "../..";
import { FormattingToolbarFactory } from "./FormattingToolbarFactoryTypes";
import { createFormattingToolbarPlugin } from "./FormattingToolbarPlugin";

export type FormattingToolbarOptions<BSchema extends BlockSchema<PSchema>, PSchema> = {
  formattingToolbarFactory: FormattingToolbarFactory<BSchema, PSchema>;
  editor: BlockNoteEditor<PSchema, BSchema>;
};

/**
 * The menu that is displayed when selecting a piece of text.
 */
export const createFormattingToolbarExtension = <
  BSchema extends BlockSchema<PSchema>,
  PSchema
>() =>
  Extension.create<FormattingToolbarOptions<BSchema, PSchema>>({
    name: "FormattingToolbarExtension",

  addProseMirrorPlugins() {
    if (!this.options.formattingToolbarFactory || !this.options.editor) {
      throw new Error(
        "required args not defined for FormattingToolbarExtension"
      );
    }

      return [
        createFormattingToolbarPlugin({
          tiptapEditor: this.editor,
          editor: this.options.editor,
          formattingToolbarFactory: this.options.formattingToolbarFactory,
          pluginKey: new PluginKey("FormattingToolbarPlugin"),
        }),
      ];
    },
  });
