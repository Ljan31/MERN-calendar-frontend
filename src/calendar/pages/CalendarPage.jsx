import { useState, useEffect } from 'react';
import { Calendar} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from "../"
import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';


export const CalendarPage = () => {

  const { user } = useAuthStore();

  const { openDateModal, isDateModalOpen } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents, setDesActiveEvent } = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');
  
  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log({event, start, end, isSelected});
    const isMyEvent = ( user.uid === event.user._id )|| ( user.uid === event.user.uid );
    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    }

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    // console.log({doubleClick: event});
    openDateModal();
  }
  const onSelect = (event) => {
    // console.log({Click: event});
    setActiveEvent( event );
    // desactivar btn eliminar 
    // todo validar si modal esta abierto, para no desactivar el evento?
    if( isDateModalOpen === false ){
      setTimeout(() => {
        setDesActiveEvent();
      }, 7000);
    }
  }
  const onViewChanged = (event) => {
    // console.log({viewChanged: event});
    localStorage.setItem('lastView', event);
    setLastView( event );
  }

  useEffect(()=>{
    startLoadingEvents()
  }, [])

  return (
    <>
      <Navbar/>
      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={onSelect}
        onView={ onViewChanged }
      />

      <CalendarModal/>
      <FabAddNew/>
      <FabDelete/>
    </>
  )
}