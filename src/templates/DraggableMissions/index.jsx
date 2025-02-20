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
              {(provided, snapshot) => (
                <li 
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    width: snapshot.isDragging ? "1px" : "auto",
                    position: snapshot.isDragging ? "absolute" : "relative",
                    zIndex: snapshot.isDragging ? 9999 : "auto",
                    opacity: snapshot.isDragging ? 0.5 : 1,
                  }}
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