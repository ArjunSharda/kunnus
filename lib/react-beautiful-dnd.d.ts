declare module 'react-beautiful-dnd' {
  import React from 'react';
  
  // DroppableProvided interface
  export interface DroppableProvided {
    innerRef: React.RefObject<HTMLElement>;
    droppableProps: {
      [key: string]: any;
    };
    placeholder?: React.ReactElement | null;
  }

  // DroppableStateSnapshot interface
  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: string;
    draggingFromThisWith?: string;
  }

  // DraggableProvided interface
  export interface DraggableProvided {
    innerRef: React.RefObject<HTMLElement>;
    draggableProps: {
      [key: string]: any;
    };
    dragHandleProps: {
      [key: string]: any;
    } | null;
  }

  // DraggableStateSnapshot interface
  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: {
      duration: number;
      curve: string;
      moveTo: {
        x: number;
        y: number;
      };
    };
    draggingOver?: string;
    combineWith?: string;
    combineTargetFor?: string;
    mode?: 'FLUID' | 'SNAP';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const DragDropContext: React.ComponentType<any>;
  
  export interface DroppableProps {
    droppableId: string;
    type?: string;
    direction?: 'horizontal' | 'vertical';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    ignoreContainerClipping?: boolean;
    renderClone?: any;
    getContainerForClone?: () => HTMLElement;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement;
  }
  export const Droppable: React.ComponentType<DroppableProps>;
  
  export interface DraggableProps {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement;
  }
  export const Draggable: React.ComponentType<DraggableProps>;
  
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
    reason?: 'DROP' | 'CANCEL';
    mode?: 'FLUID' | 'SNAP';
    combine?: {
      draggableId: string;
      droppableId: string;
    };
  }
}
