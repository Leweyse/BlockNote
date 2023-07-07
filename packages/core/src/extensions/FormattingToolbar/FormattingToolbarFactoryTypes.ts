import { EditorElement, ElementFactory } from "../../shared/EditorElement";
import { BlockNoteEditor } from "../../BlockNoteEditor";
import { BlockSchema } from "../Blocks/api/blockTypes";

export type FormattingToolbarStaticParams<BSchema extends BlockSchema<PSchema>, PSchema> = {
  editor: BlockNoteEditor<PSchema, BSchema>;

  getReferenceRect: () => DOMRect;
};

export type FormattingToolbarDynamicParams = {};

export type FormattingToolbar = EditorElement<FormattingToolbarDynamicParams>;
export type FormattingToolbarFactory<BSchema extends BlockSchema<PSchema>, PSchema> =
  ElementFactory<
    FormattingToolbarStaticParams<BSchema, PSchema>,
    FormattingToolbarDynamicParams
  >;
