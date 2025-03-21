declare module 'react-beautiful-dnd' {
  // Using Record<string, unknown> instead of any
  export const DragDropContext: any;
  export const Droppable: any;
  export const Draggable: any;
  
  export interface DropResult {
    destination: {
      droppableId: string;
      index: number;
    } | null;
    source: {
      droppableId: string;
      index: number;
    };
    draggableId: string;
  }
}
