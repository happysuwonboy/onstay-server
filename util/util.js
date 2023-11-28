export const getDateTime = (numericDate) => {
  const timeStamp = numericDate*1000;
  const dateTime = new Date(timeStamp+9*60*60*1000).toISOString(); // toISOString은 영국 기준으로 시간을 반환하므로 9시간 더해줌\
  const formattedDateTime = dateTime.replace('T', ' ').split('.')[0] 
  return formattedDateTime
}