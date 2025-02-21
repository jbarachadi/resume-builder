import React from 'react'
import { Droppable, Draggable } from "react-beautiful-dnd";

const DraggableMissions = ({ experience, droppableId }) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {experience.missions.map((mission, idx) => (
            <Draggable key={`${droppableId}-${idx}`} draggableId={`${droppableId}-${idx}`} index={idx}>
              {(provided) => (
                <li 
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {mission}
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  )
}

export default DraggableMissions