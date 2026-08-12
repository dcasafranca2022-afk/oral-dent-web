function toggleMenu(){
  const nav=document.querySelector('.nav nav');
  if(nav) nav.classList.toggle('mobile-open');
}

const monthNames=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
let calendarDate=new Date();
calendarDate.setDate(1);
let selectedDate=null;

function pad(n){return String(n).padStart(2,'0');}
function formatDate(date){
  return `${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}`;
}
function isSameDay(a,b){return a&&b&&a.toDateString()===b.toDateString();}
function renderCalendar(){
  const calendar=document.getElementById('calendar');
  if(!calendar) return;
  const month=document.getElementById('calendarMonth');
  const year=document.getElementById('calendarYear');
  month.textContent=monthNames[calendarDate.getMonth()].charAt(0).toUpperCase()+monthNames[calendarDate.getMonth()].slice(1);
  year.textContent=calendarDate.getFullYear();
  calendar.innerHTML='';
  const firstDay=new Date(calendarDate.getFullYear(),calendarDate.getMonth(),1).getDay();
  const offset=(firstDay+6)%7;
  const days=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+1,0).getDate();
  const today=new Date(); today.setHours(0,0,0,0);
  for(let i=0;i<offset;i++){const empty=document.createElement('button');empty.className='day empty';empty.tabIndex=-1;calendar.appendChild(empty);}
  for(let d=1;d<=days;d++){
    const date=new Date(calendarDate.getFullYear(),calendarDate.getMonth(),d);
    const btn=document.createElement('button');btn.type='button';btn.className='day';btn.textContent=d;
    if(date<today){btn.classList.add('past');btn.disabled=true;}
    if(isSameDay(date,today))btn.classList.add('today');
    if(isSameDay(date,selectedDate))btn.classList.add('selected');
    btn.addEventListener('click',()=>selectDate(date));
    calendar.appendChild(btn);
  }
}
function selectDate(date){
  selectedDate=new Date(date);
  document.getElementById('selectedDate').textContent=formatDate(selectedDate);
  renderCalendar();
}
function requestAppointment(){
  const status=document.getElementById('appointmentStatus');
  const name=document.getElementById('patientName').value.trim();
  const phone=document.getElementById('patientPhone').value.trim();
  const time=document.getElementById('appointmentTime').value;
  const service=document.getElementById('appointmentService').value;
  const message=document.getElementById('patientMessage').value.trim();
  if(!selectedDate||!time||!name||!phone){status.className='appointment-status error';status.textContent='Por favor selecciona fecha, horario, nombre y celular.';return;}
  const request={id:Date.now(),date:formatDate(selectedDate),time,name,phone,service,message,status:'Pendiente'};
  const whatsappNumber='51981760638';
  const whatsappText =
    `Hola, deseo solicitar una cita en Oral Dent.%0A%0A` +
    `Nombre: ${encodeURIComponent(request.name)}%0A` +
    `Celular: ${encodeURIComponent(request.phone)}%0A` +
    `Fecha solicitada: ${encodeURIComponent(request.date)}%0A` +
    `Horario preferido: ${encodeURIComponent(request.time)}%0A` +
    `Servicio: ${encodeURIComponent(request.service)}%0A` +
    `Mensaje: ${encodeURIComponent(request.message || 'Sin mensaje adicional')}%0A%0A` +
    `Quedo atento(a) a la confirmación de disponibilidad.`;
  const whatsappUrl=`https://wa.me/${whatsappNumber}?text=${whatsappText}`;
  status.className='appointment-status';
  status.innerHTML=`Solicitud preparada para WhatsApp.<br>Se abrirá WhatsApp para enviarla al <strong>981 760 638</strong>.`;
  window.open(whatsappUrl,'_blank');
}
document.addEventListener('DOMContentLoaded',()=>{
  renderCalendar();
  document.getElementById('prevMonth')?.addEventListener('click',()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar();});
  document.getElementById('nextMonth')?.addEventListener('click',()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar();});
  document.getElementById('requestAppointment')?.addEventListener('click',requestAppointment);
});
