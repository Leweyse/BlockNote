/** Define the main block types **/
import { z } from "zod";
import { Node, NodeConfig } from "@tiptap/core";
import { BlockNoteEditor } from "../../../BlockNoteEditor";
import { InlineContent, PartialInlineContent } from "./inlineContentTypes";

// A configuration for a TipTap node, but with stricter type constraints on the
// "name" and "group" properties. The "name" property is now always a string
// literal type, and the "blockGroup" property cannot be configured as it should
// always be "blockContent". Used as the parameter in `createTipTapNode`.
export type TipTapNodeConfig<
  Name extends string,
  Options = any,
  Storage = any
> = {
  [K in keyof NodeConfig<Options, Storage>]: K extends "name"
    ? Name
    : K extends "group"
    ? never
    : NodeConfig<Options, Storage>[K];
};

// A TipTap node with stricter type constraints on the "name" and "group"
// properties. The "name" property is now a string literal type, and the
// "blockGroup" property is now "blockContent". Returned by `createTipTapNode`.
export type TipTapNode<
  Name extends string,
  Options = any,
  Storage = any
> = Node<Options, Storage> & {
  name: Name;
  group: "blockContent";
};

// Defines multiple block prop specs. The key of each prop is the name of the
// prop, while the value is a corresponding prop spec. This should be included
// in a block config or schema. From a prop schema, we can derive both the props'
// internal implementation (as TipTap node attributes) and the type information
// for the external API.
export type PropSchema<T> = z.ZodSchema<T>;

// Defines the config for a single block. Meant to be used as an argument to
// `createBlockSpec`, which will create a new block spec from it. This is the
// main way we expect people to create custom blocks as consumers don't need to
// know anything about the TipTap API since the associated nodes are created
// automatically.
export type BlockConfig<
  Type extends string,
  PSchema,
  ContainsInlineContent extends boolean,
  BSchema extends BlockSchema<PSchema>
> = {
  // Attributes to define block in the API as well as a TipTap node.
  type: Type;
  readonly propSchema: PropSchema<PSchema>;
  readonly props: PSchema;

  // Additional attributes to help define block as a TipTap node.
  containsInlineContent: ContainsInlineContent;
  render: (
    /**
     * The custom block to render
     */
    block: SpecificBlock<
      BSchema & { [k in Type]: BlockSpec<Type, PSchema> },
      Type
    >,
    /**
     * The BlockNote editor instance
     * This is typed generically. If you want an editor with your custom schema, you need to
     * cast it manually, e.g.: `const e = editor as BlockNoteEditor<typeof mySchema>;`
     */
    editor: BlockNoteEditor<PSchema, { [k in Type]: BlockSpec<Type, PSchema> }>
    // (note) if we want to fix the manual cast, we need to prevent circular references and separate block definition and render implementations
    // or allow manually passing <BSchema>, but that's not possible without passing the other generics because Typescript doesn't support partial inferred generics
  ) => ContainsInlineContent extends true
    ? {
        dom: HTMLElement;
        contentDOM: HTMLElement;
      }
    : {
        dom: HTMLElement;
      };
};

// Defines a single block spec, which includes the props that the block has and
// the TipTap node used to implement it. Usually created using `createBlockSpec`
// though it can also be defined from scratch by providing your own TipTap node,
// allowing for more advanced custom blocks.
export type BlockSpec<Type extends string, PSchema> = {
  readonly propSchema: PropSchema<PSchema>;
  readonly props: PSchema;
  node: TipTapNode<Type>;
};

// Defines multiple block specs. Also ensures that the key of each block schema
// is the same as name of the TipTap node in it. This should be passed in the
// `blocks` option of the BlockNoteEditor. From a block schema, we can derive
// both the blocks' internal implementation (as TipTap nodes) and the type
// information for the external API.
export type BlockSchema<PSchema> = Record<string, BlockSpec<string, PSchema>>

// Converts each block spec into a Block object without children. We later merge
// them into a union type and add a children property to create the Block and
// PartialBlock objects we use in the external API.
type BlocksWithoutChildren<TSchema, BSchema extends BlockSchema<TSchema>> = {
  [BType in keyof BSchema]: {
    id: string;
    type: BType;
    props: z.infer<BSchema[BType]["propSchema"]>;
    content: InlineContent[];
  };
};

// Converts each block spec into a Block object without children, merges them
// into a union type, and adds a children property
export type Block<BSchema extends BlockSchema<PSchema>,
  PSchema = z.infer<BSchema[keyof BSchema]["propSchema"]>
> =
  BlocksWithoutChildren<PSchema, BSchema>[keyof BlocksWithoutChildren<PSchema, BSchema>] & {
    children: Block<BSchema>[];
  };

export type SpecificBlock<
  BSchema extends BlockSchema<PSchema>,
  BlockType extends keyof BSchema,
  PSchema = z.infer<BSchema[BlockType]["propSchema"]>
> = BlocksWithoutChildren<PSchema, BSchema>[BlockType] & {
  children: Block<BSchema>[];
};

// Same as BlockWithoutChildren, but as a partial type with some changes to make
// it easier to create/update blocks in the editor.
type PartialBlocksWithoutChildren<BSchema extends BlockSchema<PSchema>, 
  PSchema = z.infer<BSchema[keyof BSchema]["propSchema"]>
> = {
  [BType in keyof BSchema]: Partial<{
    id: string;
    type: BType;
    props: Partial<z.infer<BSchema[BType]["propSchema"]>>;
    content: PartialInlineContent[] | string;
  }>;
};

// Same as Block, but as a partial type with some changes to make it easier to
// create/update blocks in the editor.
export type PartialBlock<BSchema extends BlockSchema<PSchema>, 
  PSchema = z.infer<BSchema[keyof BSchema]["propSchema"]>
> =
  PartialBlocksWithoutChildren<BSchema, PSchema>[keyof PartialBlocksWithoutChildren<BSchema, PSchema>] &
    Partial<{
      children: PartialBlock<BSchema, PSchema>[];
    }>;

export type BlockIdentifier = { id: string } | string;
