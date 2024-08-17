import { useState, useMemo, useEffect } from "react";
import Modal from "react-modal"
import { addHours, differenceInSeconds } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";

import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";

import { useCalendarStore, useUiStore } from "../../hooks";


registerLocale('es', es);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root'); // id='root' index

export const CalendarModal = () => {

  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent, setDesActiveEvent } = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours( new Date(), 2),
  });

  const titleClass = useMemo( ()=> {
    if(!formSubmitted) return '';

    return (formValues.title.length > 0)
      ? ''
      : 'is-invalid';
  },[formValues.title, formSubmitted]);

  useEffect( ()=>{
    if( activeEvent !== null ){
      setFormValues({ ...activeEvent });
    }
  }, [activeEvent]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const onCloseModal = () => {
    // console.log('cerrando modal');
    // todo activeEvent null
    setDesActiveEvent();
    closeDateModal();
  }
  
  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event
    })
  }

  const onSubmit = async(event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const difference = differenceInSeconds( formValues.end, formValues.start );
    // console.log({difference});
    if(isNaN( difference ) || difference <= 0){
      // console.log('Error en fechas');
      Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error');
      return;
    }

    if( formValues.title.length <= 0 ) return;

    console.log(formValues);

    // todo: cerrar modal, remover errores en pantalla
    await startSavingEvent( formValues );
    closeDateModal();
    setFormSubmitted(false);
    
  }

  return (
    <Modal
      isOpen={ isDateModalOpen }
      onRequestClose={onCloseModal}
      style={customStyles}
      className='modal'
      overlayClassName='modal-fondo'
      closeTimeoutMS={200}
    >
      
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={ onSubmit }>

          <div className="form-group mb-2">
              <label>Fecha y hora inicio</label>
              <DatePicker
                selected={ formValues.start }
                onChange={ (event) => onDateChanged(event, 'start') }
                className="form-control"
                dateFormat='Pp'
                showTimeSelect
                locale="es"
                timeCaption="Hora"
              />
          </div>

          <div className="form-group mb-2">
              <label>Fecha y hora fin</label>
              <DatePicker
                minDate={ formValues.start }
                selected={ formValues.end }
                onChange={ (event) => onDateChanged(event, 'end') }
                className="form-control"
                dateFormat='Pp'
                showTimeSelect
                locale="es"
                timeCaption="Hora"
              />
          </div>

          <hr />
          <div className="form-group mb-2">
              <label>Titulo y notas</label>
              <input 
                  type="text" 
                  className={`form-control ${ titleClass }`}
                  placeholder="Título del evento"
                  name="title"
                  autoComplete="off"
                  value={formValues.title}
                  onChange={ onInputChanged }
              />
              <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
          </div>

          <div className="form-group mb-2">
              <textarea 
                  type="text" 
                  className="form-control"
                  placeholder="Notas"
                  rows="5"
                  name="notes"
                  value={formValues.notes}
                  onChange={ onInputChanged }
              ></textarea>
              <small id="emailHelp" className="form-text text-muted">Información adicional</small>
          </div>

          <button
              type="submit"
              className="btn btn-outline-primary btn-block"
          >
              <i className="far fa-save"></i>
              <span> Guardar</span>
          </button>

      </form>

    </Modal>
  )
}