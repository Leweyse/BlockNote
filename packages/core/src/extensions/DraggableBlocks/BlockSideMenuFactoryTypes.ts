import { EditorElement, ElementFactory } from "../../shared/EditorElement";
import { BlockNoteEditor } from "../../BlockNoteEditor";
import { Block, BlockSchema } from "../Blocks/api/blockTypes";

export type BlockSideMenuStaticParams<BSchema extends BlockSchema<PSchema>, PSchema> = {
  editor: BlockNoteEditor<PSchema, BSchema>;

  addBlock: () => void;

  blockDragStart: (event: DragEvent) => void;
  blockDragEnd: () => void;

  freezeMenu: () => void;
  unfreezeMenu: () => void;

  getReferenceRect: () => DOMRect;
};

export type BlockSideMenuDynamicParams<BSchema extends BlockSchema<PSchema>, PSchema> = {
  block: Block<BSchema>;
};

export type BlockSideMenu<BSchema extends BlockSchema<PSchema>, PSchema> = EditorElement<
  BlockSideMenuDynamicParams<BSchema, PSchema>
>;
export type BlockSideMenuFactory<BSchema extends BlockSchema<PSchema>, PSchema> = ElementFactory<
  BlockSideMenuStaticParams<BSchema, PSchema>,
  BlockSideMenuDynamicParams<BSchema, PSchema>
>;
