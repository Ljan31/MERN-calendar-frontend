import { useDispatch, useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onSetDesActiveEvent, onUpdateEvent } from "../store";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";


export const useCalendarStore = () => {
  
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector( state => state.calendar );
  const { user } = useSelector( state => state.auth );

  const setActiveEvent = ( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) );
  }

  const setDesActiveEvent = () => {
    dispatch( onSetDesActiveEvent() );
  }


  const startSavingEvent = async( calendarEvent ) => {
    // todo: llegar al backend

    try {
      
      if( calendarEvent.id ){
        // update
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch( onUpdateEvent( {...calendarEvent, user} ) );
        return;
      }
      
      // crear
      const {data} = await calendarApi.post('/events', calendarEvent);
      console.log({data})
      dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user}) );
    
    } catch (error) {
      console.log(error);
      Swal.fire('Error al guardar', error.response.data?.msg, 'error');
    }

  }

  const startDeletingEvent = async() => {
    // todo: llegar al backend
    try {
      
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch( onDeleteEvent() );
      
    } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar', error.response.data?.msg, 'error');
    }
  }

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get('/events');
      // console.log({data});
      const events = convertEventsToDateEvents(data.eventos);
      // console.log(events)
      dispatch(onLoadEvents(events));

    } catch (error) {
      console.log('Error cargando eventos');
      console.log(error)
    }
  }

  return {
    //* propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //* metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
    setDesActiveEvent
  }
}