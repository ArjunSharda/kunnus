declare module 'react-beautiful-dnd' {
  import React from 'react';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const DragDropContext: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Droppable: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Draggable: React.ComponentType<any>;
  
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
