import { Block, BlockSchema } from "./blockTypes";

export type Selection<BSchema extends BlockSchema<PSchema>, PSchema> = {
  blocks: Block<BSchema, PSchema>[];
};
