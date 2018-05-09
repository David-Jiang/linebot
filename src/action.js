export const onItemAdd = (payload: { id: number, text: string }) => (
  { type: 'ADD_ITEM', payload }
);

export const onItemDel = (id: number) => ({ type: 'DEL_ITEM', id });